"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import {Button, ButtonGroup} from "@nextui-org/button";

export default function WalletConnectButton() {
    const { open } = useWeb3Modal();
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    const handleClick = () => {
        if (isConnected) {
            disconnect();
        } else {
            open();
        }
    };

    return (
        <Button  color="primary" onClick={handleClick}>
            {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </Button>
    );
}