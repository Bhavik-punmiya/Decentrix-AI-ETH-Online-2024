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
    Switch,
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
          console.log("Deploying contract to Nillion...");
      
          try {
              // Check if Kepler is installed
              if (typeof window.kepler === 'undefined') {
                  toast.error("Please install Kepler wallet to deploy the contract.");
                  return;
              }
      
              console.log("Requesting Kepler connection...");
              setIsDeploying(true);
      
              // Request account access
              await window.kepler.enable();
      
              // Get the connected account
              const accounts = await window.kepler.request({ method: 'eth_accounts' });
              if (accounts.length === 0) {
                  throw new Error("No accounts found. Please connect to Kepler wallet.");
              }
              const account = accounts[0];
      
              console.log("Connected to Kepler wallet:", account);
      
              // Check if connected to Nillion network
              const chainId = await window.kepler.request({ method: 'eth_chainId' });
              if (chainId !== '0x8ba') { // Nillion chain ID in hex
                  toast.error("Please switch to the Nillion network in Kepler wallet.");
                  return;
              }
      
              console.log("Connected to Nillion network.");
      
              // Deploy the contract
              const txParams = {
                  from: account,
                  data: result.bytecode,
                  gas: '0x500000', // Adjust gas limit as needed
              };
      
              const txHash = await window.kepler.request({
                  method: 'eth_sendTransaction',
                  params: [txParams],
              });
      
              console.log("Transaction sent. Hash:", txHash);
      
              // Wait for transaction receipt
              let receipt = null;
              while (receipt === null) {
                  receipt = await window.kepler.request({
                      method: 'eth_getTransactionReceipt',
                      params: [txHash],
                  });
                  if (!receipt) {
                      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
                  }
              }
      
              const contractAddress = receipt.contractAddress;
              console.log("Contract deployed at:", contractAddress);
      
              // Get the block explorer URL (update this when Nillion has an official explorer)
              const blockExplorerUrl = `https://explorer.nillion.com/address/${contractAddress}`; // Placeholder URL
      
              const solidityCode = suggestions; // Assuming suggestions holds your Solidity code
              const fileName = `Contract_${contractAddress}.sol`; // Generate a unique file name
              const solidityFilePath = await saveSolidityCode(solidityCode, fileName); // Save the Solidity code and get the file path
      
              // Prepare contract data to save
              const contractData = {
                  chainId: parseInt(chainId, 16),
                  contractAddress: contractAddress,
                  abi: result.abi,
                  bytecode: result.bytecode,
                  blockExplorerUrl: blockExplorerUrl,
                  solidityFilePath: solidityFilePath,
                  deploymentDate: new Date().toISOString(),
              };
      
              // Get user email from context
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
                      <a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-500 hover:underline">
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

    //useEffect to monitor sugeestion changes and compile code

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
                    <div className=" p-4 rounded flex items-center space-x-4 justify-end my-2">
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

            )
                ;
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
                                <Avatar isBordered radius="md" src="/chain/nillion-logo.png"/>
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
                                className="w-full h-full p-4 rounded-xl border"
                                placeholder="E.g. I want to create a smart contract that allows users to create a token"
                            />
                        </div>

                        <div className="max-w-xl">
                            <Button
                                disabled={loading}
                                isLoading={loading} // Use isLoading to show the loading state
                                onClick={() => {
                                    handleRunAgent(userPrompt);
                                }}
                                color="default"
                            >
                                {loading ? progressMessage : 'Generate code'}
                            </Button>
                        </div>

                        <div>
                            {
                                error && (
                                    <div className="text-red-500 text-sm m-1">
                                        <p>{error}</p>
                                    </div>
                                )
                            }
                        </div>
                        {contractState.isCompiled && contractState.abi ? (
                            <ContractInteraction />
                        ) : (
                            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded mt-3">
                                <p className="font-bold">No Contracts Compiled Yet</p>
                                <p className="mt-2">Please compile a contract to interact with it.</p>
                            </div>
                        )}

                        <div className="my-5">
                            {RenderResult()}
                        </div>


                    </Card>
                </div>
                <div className="w-1/2 p-4 flex flex-col">
                    <Card className="flex-grow">
                        <CardHeader className="flex justify-between items-center px-4 py-2">
                            <div className="flex items-center">

                                <h2 className="text-xl font-bold">Nillion</h2>

                            </div>
                            <div className="py-2">

                                <Button
                                    color="default"
                                    onClick={compileCode}
                                    className=""
                                    isLoading={isCompiling} // Use isLoading to indicate loading state
                                >
                                    {isCompiling ? "Compiling..." : "Compile"} {/* Dynamic text based on state */}
                                </Button>
                                <Button
                                    color="success"
                                    onClick={DeployContract}
                                    isLoading={isDeploying}
                                    className="ml-4"
                                >
                                    {isDeploying ? "Deploying..." : "Deploy"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="p-4 h-full">
                            <div
                                className="h-full overflow-auto"
                                style={{maxHeight: "calc(100vh - 200px)"}}
                            >

                                <div className="flex flex-col h-full">
                                    <div className="flex-grow h-screen">
                                        <SolidityEditor
                                            code={suggestions}
                                            onChange={handleCodeChange}
                                            defaultValue={"// Solidity code will appear here"}
                                        />
                                    </div>
                                </div>

                            </div>

                        </CardBody>
                    </Card>
                </div>
            </div>

        </div>
    );
}
