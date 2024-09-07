import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { sepolia, Chain } from "wagmi/chains";

// Ensure the WalletConnect project ID is defined
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");

// Metadata for the application
const metadata = {
    name: "Web3Modal Example",
    description: "Web3Modal Example",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Rootstock Testnet configuration
const rootstockTestnet: Chain = {
    id: 31,
    name: "Rootstock Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Rootstock Testnet Ether",
        symbol: "tRSK",
    },
    rpcUrls: {
        default: { http: ["https://rpc.testnet.rootstock.io/jggMDTcHMyqeQhJChAG7xhsjMIgLai-T"] }
    },
    blockExplorers: {
        default: { name: "Rootstock Explorer", url: "https://explorer.testnet.rsk.co" },
    },
};

// Galadriel Devnet configuration
const galadriealDevnet: Chain = {
    id: 696969,
    name: "Galadriel Devnet",
    nativeCurrency: {
        decimals: 18,
        name: "Galadriel",
        symbol: "GAL",
    },
    rpcUrls: {
        default: { http: ["https://devnet.galadriel.com"] }
    },
    blockExplorers: {
        default: { name: "Galadriel Explorer", url: "https://explorer.galadriel.com" },
    },
};

// Morph Holesky Testnet configuration
const morphHoleskyTestnet: Chain = {
    id: 2810,
    name: "Morph Holesky Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Morph Holesky Testnet Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: { http: [`https://2810.rpc.thirdweb.com/${process.env.NEXT_PUBLIC_THIRDWEB_SECRETKEY}`] }
    },
    blockExplorers: {
        default: { name: "Morph Explorer", url: "https://explorer-holesky.morphl2.io" },
    },
};

// Export the configuration with chains included
export const config = defaultWagmiConfig({
    chains: [sepolia, galadriealDevnet, rootstockTestnet, morphHoleskyTestnet], // Add Morph Holesky Testnet here
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});