"use client";
import React, {useState} from "react";
import {
    NextUIProvider,
    Button,
    Card,
    CardBody,
    CardHeader,
    Switch,
} from "@nextui-org/react";
import SolidityEditor from "@/components/SolidityEditor"; // Ensure this path is correct
import axios from "axios";
import WalletConnectButton from "../../components/WalletConnectButton";
import { useAccount } from "wagmi";

export default function Editor() {
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);
    const [view, setView] = useState("code");
const account = useAccount();
    const compileCode = async () => {
        try {
            const formData = new FormData();
            formData.append(
                "file",
                new Blob([code], {type: "text/plain"}),
                "Contract.sol"
            );
            const response = await axios.post(
                "http://localhost:8080/api/compile",
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"},
                }
            );
            setResult(response.data);
            console.log(response.data);
        } catch (error) {
            setResult({error: error.message});
        }
    };
    const handleCodeChange = (value) => {
        setCode(value);
    };

    const renderResult = () => {
        if (!result) {
            return (
                <div className="text-gray-600">
                    No results yet. Write some code and hit "Compile"!
                </div>
            );
        }
        if (result.errors && result.errors.length > 0) {
            const error = result.errors[0];
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
                    <h3 className="font-bold">Compilation Error:</h3>
                    <p>{error.message}</p>
                </div>
            );
        }
        if (result.status === "success") {
            return (
                <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
                    <h3 className="font-bold">Compilation Successful!</h3>
                    <h4 className="mt-2">Bytecode:</h4>
                    <pre className="mt-1 text-sm overflow-auto max-h-40">
            {result.bytecode}
          </pre>
                    <h4 className="mt-2">ABI:</h4>
                    <pre className="mt-1 text-sm overflow-auto max-h-40">
            {JSON.stringify(result.abi, null, 2)}
          </pre>
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
        <div className="flex h-full bg-[rgb(235, 232, 224)]">
            <div className="w-1/2 p-4">
                {/* Left side: Placeholder for Chat Bot UI */}
                <WalletConnectButton/>
                {
                        account.isConnected && (
                            <div>
                                <h1>Connected</h1>
                                <p>Account: {account?.address}</p>
                            </div>
                        )
                }
            </div>
            <div className="w-1/2 p-4 flex flex-col">
                <Card className="flex-grow">
                    <CardHeader className="flex justify-between items-center px-4 py-2">
                        <div className="flex items-center">
                            <Button color="primary" onClick={compileCode} className="mr-4">
                                Compile
                            </Button>
                            <h2 className="text-xl font-bold">Solidity Editor</h2>
                        </div>
                        <Switch defaultSelected color="default">
                            Default
                        </Switch>
                    </CardHeader>
                    <CardBody className="p-4 h-full">
                        <div
                            className="h-full overflow-auto"
                            style={{maxHeight: "calc(100vh - 200px)"}}
                        >
                            {view === "code" ? (
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow h-screen">
                                        <SolidityEditor
                                            code={code}
                                            onChange={handleCodeChange}
                                            defaultValue={"// Solidity code will appear here"}
                                        />
                                    </div>
                                </div>
                            ) : (
                                renderResult()
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
