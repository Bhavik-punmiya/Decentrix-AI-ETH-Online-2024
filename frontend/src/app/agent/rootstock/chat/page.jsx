"use client";
import ChatUi from "@/components/chatui";
import {Avatar} from "@nextui-org/react";
import React, {useState} from "react";
import WalletConnectButton from "@/components/WalletConnectButton";
import {useAccount} from "wagmi";


export default function ChatPage() {

    const account = useAccount();

    const shortenAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 3)}...${address.slice(-3)}`;
    };

    return (
      <div className="min-h-screen">
          <div className="flex items-center space-x-4 w-fit bg-gray-100 p-4 rounded-lg mt-5 shadow-md mx-auto">
              <Avatar isBordered radius="md" src="/chain/rootstock-logo.png"/>
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
          <ChatUi/>
      </div>
  );
}