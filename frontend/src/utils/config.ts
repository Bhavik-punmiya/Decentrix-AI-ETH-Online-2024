import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { sepolia, Chain } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
    name: "Web3Modal Example",
    description: "Web3Modal Example",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const galadriealDevnet: Chain = {
    id: 696969,
    name: "Galadriel Devnet",
    nativeCurrency: {
        decimals: 18,
        name: "Galadriel",
        symbol: "GAL",
    },
    rpcUrls: {
        default: { http: ["https://devnet.galadriel.com",]}
    },
    blockExplorers: {
        default: { name: "Galadriel Explorer", url: "https://explorer.galadriel.com" },
    },
};

export const config = defaultWagmiConfig({
    chains: [sepolia, galadriealDevnet],
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});