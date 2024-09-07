"use client";
import React, {useState, useContext} from "react";
import {Avatar} from "@nextui-org/react";
import {ethers} from "ethers";
import {
    NextUIProvider,
    Button,
    Card,
    CardBody,
    CardHeader,
} from "@nextui-org/react";
import SolidityEditor from "@/components/SolidityEditor";
import axios from "axios";
import WalletConnectButton from "@/components/WalletConnectButton";
import {useAccount} from "wagmi";
import {useSolidityCodeAgentContract} from '@/hooks/useSolidityCodeAgentContract';
import {FaClipboard, FaClipboardCheck} from "react-icons/fa";
import {Toaster, toast} from 'react-hot-toast';
import { useContractState } from '@/contexts/ContractContext';
import ContractInteraction from '@/components/ContractInteractions';
import { saveContractData, saveSolidityCode } from "@/lib/contractService";
import { GlobalContext } from "@/contexts/UserContext";
import { starknet, Account, Contract, defaultProvider } from "starknet";

export default function Editor() {
    const {
        code,
        setCode,
        userPrompt,
        setUserPrompt,
        suggestions,
        loading,
        error,
        handleRunAgent,
        progressMessage,
        setSuggestions,
    } = useSolidityCodeAgentContract();

    const [result, setResult] = useState(null);
    const { setContractState } = useContractState();
    const [view, setView] = useState("code");
    const account = useAccount();
    const [isCompiling, setCompiling] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const { contractState } = useContractState();
    const { userData } = useContext(GlobalContext);

    const compileCode = async () => {
        setCompiling(true);
        try {
            const formData = new FormData();
            formData.append(
                "file",
                new Blob([suggestions], { type: "text/plain" }),
                "Contract.sol"
            );
            const response = await axios.post(
                "https://msl8g5vbv6.execute-api.ap-south-1.amazonaws.com/prod/api/contract/compile",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setResult(response.data);
            console.log(response.data);
            
            // Update the shared contract state
            if (response.data.status === "success") {
                setContractState(prevState => ({
                    ...prevState,
                    abi: response.data.abi,
                    bytecode: response.data.bytecode,
                    isCompiled: true,
                }));
            }
        } catch (error) {
            setResult({ error: error.message });
        } finally {
            setCompiling(false);
        }
    };

    const DeployContract = async () => {
        if (!result || result.status !== "success") {
            toast.error("Please compile the contract successfully before deploying.");
            return;
        }
        console.log("Deploying contract to StarkNet...");

        try {
            setIsDeploying(true);

            // Connect to StarkNet
            const starknetAccount = new Account(defaultProvider);

            // Deploy the contract to StarkNet
            const contractFactory = new Contract(result.abi, result.bytecode, starknetAccount);
            const deployResponse = await contractFactory.deploy();

            // Wait for the contract to be deployed
            const contractAddress = deployResponse.contract_address;
            console.log("Contract deployed at address:", contractAddress);

            const blockExplorerUrl = `https://testnet.starkscan.co/contract/${contractAddress}`;

            // Save Solidity code to the backend
            const solidityCode = suggestions;
            const fileName = `Contract_${contractAddress}.sol`;
            const solidityFilePath = await saveSolidityCode(solidityCode, fileName);

            // Prepare contract data to save
            const contractData = {
                chainId: 'StarkNet',
                contractAddress: contractAddress,
                abi: result.abi,
                bytecode: result.bytecode,
                blockExplorerUrl: blockExplorerUrl,
                solidityFilePath: solidityFilePath,
                deploymentDate: new Date().toISOString(),
            };

            if (userData && userData.email) {
                await saveContractData(contractData, userData.email);
            } else {
                console.error("User email not available");
            }

            await setContractState(prevState => ({
                ...prevState,
                address: contractAddress,
                isDeployed: true,
                blockExplorerUrl: blockExplorerUrl,
            }));

            toast.success(
                <div>
                    Contract deployed successfully!
                    <a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-black-500 hover:underline">
                        View on Block Explorer
                    </a>
                </div>,
                { duration: 5000 }
            );
        } catch (error) {
            console.error("Error deploying contract:", error);
            toast.error("Failed to deploy contract. Check the console for details.");
        } finally {
            setIsDeploying(false);
        }
    };

    const shortenAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 3)}...${address.slice(-3)}`;
    };

    const handleCodeChange = (value) => {
        setSuggestions(value);
    };

    const RenderResult = () => {
        const [ABIcopied, setABICopied] = useState(false);
        const [Bytecopied, setByteCopied] = useState(false);

        const copyToClipboard = (text, ele) => {
            console.log(text);
            navigator.clipboard.writeText(text);
        };

        if (!result) {
            return (
                <div className="text-gray-600 ">
                    Compilation results will appear here.
                </div>
            );
        }

        if (result.errors && result.errors.length > 0) {
            const error = result.errors[0];
            return (
                <div>
                    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
                        <h3 className="font-bold">Compilation failed!</h3>
                        <p>{error.message}</p>
                    </div>
                </div>
            );
        }

        if (result.status === "success") {
            return (
                <div>
                    <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
                        <h3 className="font-bold">Compilation Successful!</h3>
                    </div>
                    <div className="p-4 rounded flex items-center space-x-4 justify-end my-2">
                        <Button color="primary" className="flex gap-2 items-center" onClick={
                            () => {
                                copyToClipboard(result.bytecode, 1)
                            }
                        }>
                            <h4 className="">
                                {
                                    Bytecopied ? "Bytecode Copied" : "Copy Bytecode"
                                }
                            </h4>
                            {
                                Bytecopied ? <FaClipboardCheck/>
                                    : <FaClipboard/>
                            }
                        </Button>
                        <Button color="primary" className="flex gap-2 items-center" onClick={() => {
                            copyToClipboard(JSON.stringify(result.abi), 0)
                        }}>
                            <h4 className="">{
                                ABIcopied ? "ABI Copied" : "Copy ABI"
                            }</h4>
                            {
                                ABIcopied ? <FaClipboardCheck/>
                                    : <FaClipboard/>
                            }
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded">
                Unexpected result format.
            </div>
        );
    };

    return (
        <div className="">
            <Toaster/>
            <div className="flex ">
                <div className="w-1/2 p-2">
                    <Card className="flex-grow h-full p-6">
                        <div className="max-w-2xl bg-gray-100 p-4 rounded-lg shadow-md">
                            <div className="flex items-center space-x-4">
                                <Avatar isBordered radius="md" src="/chain/nethermind-logo.png"/>
                                <div className="flex-grow">
                                    {account.isConnected ? (
                                        <div className="flex items-center justify-between">
                                            <span className="text-green-600 font-semibold">Connected</span>
                                            <span className="text-gray-600 text-sm">
                                            {shortenAddress(account?.address)}
                                        </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-600">Not connected</span>
                                    )}
                                </div>
                                <WalletConnectButton/>
                            </div>
                        </div>
                        <div className="my-3 h-48 mb-14">
                            <h1 className="font-bold my-2">Describe your smart contract</h1>
                            <textarea
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter your description"
                            ></textarea>
                            <Button
                                color="primary"
                                onClick={handleRunAgent}
                                className="mt-4"
                                isLoading={loading}
                            >
                                Generate Code
                            </Button>
                            {progressMessage && <p>{progressMessage}</p>}
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={() => setView("code")}>Code Editor</Button>
                            <Button onClick={() => setView("result")}>View Result</Button>
                        </div>
                        {view === "code" ? (
                            <div>
                                <SolidityEditor
                                    code={suggestions}
                                    onChange={handleCodeChange}
                                />
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        color="primary"
                                        onClick={compileCode}
                                        isLoading={isCompiling}
                                    >
                                        Compile
                                    </Button>
                                    <Button
                                        color="success"
                                        onClick={DeployContract}
                                        isLoading={isDeploying}
                                        disabled={!result || result.status !== "success"}
                                    >
                                        Deploy
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <RenderResult/>
                        )}
                    </Card>
                </div>
                <div className="w-1/2 p-4">
                    <ContractInteraction/>
                </div>
            </div>
        </div>
    );
}
