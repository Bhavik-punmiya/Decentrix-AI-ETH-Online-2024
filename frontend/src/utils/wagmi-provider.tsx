"use client";

import React, { ReactNode } from "react";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider } from "wagmi";
import { config, projectId } from "./config";

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional
});

export const WagmiProviderComp = ({
                                      children,
                                      initialState,
                                  }: {
    children: ReactNode;
    initialState?: State;
}) => {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false, // configure as per your needs
                    },
                },
            })
    );

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
};
export default WagmiProviderComp;
