"use client";
import ChatUi from "@/components/chatui";
import {Avatar} from "@nextui-org/react";
import React, {useState} from "react";
import WalletConnectButton from "@/components/WalletConnectButton";
import {useAccount} from "wagmi";
import {useNethermindCodeAgentContract} from "@/hooks/useNethermindAgentContract";


export default function ChatPage() {
    const {
        userPrompt,
        setUserPrompt,
        suggestions,
        loading,
        error,
        handleRunAgent,
        progressMessage,
    } = useNethermindCodeAgentContract();

    const account = useAccount();

    const shortenAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 3)}...${address.slice(-3)}`;
    };

    return (
        <div className="min-h-screen">

            <div className="flex gap-5 w-full px-5 justify-between items-center mt-5">
                <div className="flex flex-col  justify-center ">
                    <div className="font-bold text-2xl">Nethermind Agent</div>
                    <p className="">Our agent knows just about everything there is to know about Nethermind!</p>
                </div>

                <div className="flex items-center space-x-4 w-fit bg-gray-100 p-4 rounded-lg  shadow-md mx-auto">
                    <Avatar isBordered radius="md" src="/chain/nethermind-logo.png"/>
                    <div className="flex-grow">
                        {account.isConnected ? (
                            <div className="flex items-center justify-between">
                                <span className="text-green-600 font-semibold mr-5">Connected</span>
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
            <ChatUi
                account={account}
                userPrompt={userPrompt}
                setUserPrompt={setUserPrompt}
                suggestions={suggestions}
                loading={loading}
                error={error}
                handleRunAgent={handleRunAgent}
                progressMessage={progressMessage}
            />
        </div>
    );
}