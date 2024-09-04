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
        default: { http: ["https://rpc.testnet.rootstock.io/Bdy1104g3ShYB2xePNTtuuxOoSKoDp-"] }
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

// Export the configuration with chains included
export const config = defaultWagmiConfig({
    chains: [sepolia, galadriealDevnet, rootstockTestnet], // Add Rootstock Testnet here
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});
