"use client";
import {useContext} from "react";
import {GlobalContext} from "@/contexts/UserContext";
import Link from "next/link";
import AgentCard from '@/components/AgentCard';


function App() {
    const agentData = [

        {
            name: "Rootstock",
            logo: "/chain/rootstock-logo.png",
            description: "Rootstock is the top and oldest running Bitcoin Layer 2 Blockchain, fully EVM compatible.",
            backgroundColor: "bg-theme-gray-light",
            buttonColor: "bg-theme-gray-dark",
            chatLink: "/agent/rootstock/chat",
            codeLink: "/agent/rootstock/code"
        },
        {
            name: "Hedera",
            logo: "/chain/hedera-logo.png",
            description: "An open-source, public network governed by leading organizations around the world.",
            backgroundColor: "bg-theme-purple-light",
            buttonColor: "bg-theme-purple-dark",
            chatLink: "/agent/hedera/chat",
            codeLink: "/agent/hedera/code"
        },
        {
            name: "Blockless",
            logo: "/chain/blockless-logo.png",
            description: "Blockless is the infrastructure platform to launch, integrate, and secure Network Neutral Applications (nnApps).",
            backgroundColor: "bg-theme-purple-light",
            buttonColor: "bg-theme-purple-dark",
            chatLink: "/agent/blockless/chat",
            codeLink: "/agent/blockless/code"
        },
        {
            name: "Fhenix",
            logo: "/chain/fhenix-logo.png",
            description: "Fhenix is the first Fully Homomorphic Encryption (FHE) powered L2 to bring computation over encrypted data to Ethereum",
            backgroundColor: "bg-theme-green-light",
            buttonColor: "bg-theme-green-dark",
            chatLink: "/agent/fhenix/chat",
            codeLink: "/agent/fhenix/code"
        },
        {
            name: "Morph",
            logo: "/chain/morph-logo.jpeg",
            description: "The first optimistic zkEVM Ethereum Layer 2 solution, Morph is 100% EVM compatible.",
            backgroundColor: "bg-theme-gray-light",
            buttonColor: "bg-theme-gray-dark",
            chatLink: "/agent/morph/chat",
            codeLink: "/agent/morph/code"
        },
        {
            name: "Nillion",
            logo: "/chain/nillion-logo.png",
            description: "Nillion is a secure computation network that decentralizes trust for high-value data",
            backgroundColor: "bg-theme-gray-light",
            buttonColor: "bg-theme-gray-dark",
            chatLink: "/agent/nillion/chat",
            codeLink: "/agent/nillion/code"
        },
        {
            name: "Nethermind",
            logo: "/chain/nethermind-logo.png",
            description: "Empowering enterprises and developers worldwide to work with and build on decentralized systems.",
            backgroundColor: "bg-theme-purple-light",
            buttonColor: "bg-theme-purple-dark",
            chatLink: "/agent/nethermind/chat",
            codeLink: "/agent/nethermind/code"
        },
        {
            name: "ChainLink",
            logo: "/chain/chainlink-logo.png",
            description: "The industry standard oracle network for powering trust-minimized applications across Web2 and Web3 ⬡",
            backgroundColor: "bg-theme-green-light",
            buttonColor: "bg-theme-green-dark",
            chatLink: "/agent/chainlink/chat",
            codeLink: "/agent/chainlink/code"
        }
    ];
    return (
        <main className="w-full px-10">
            <div className="w-full px-5 pt-36 flex flex-col justify-center items-center gap-8">
                <div className="text-4xl md:text-6xl mx-auto text-center">Think <span className="">Ideas</span>, Not
                    Code.
                </div>
                <button onClick={() => {
                    document.getElementById("agents")?.scrollIntoView({behavior: "smooth"});
                }} className="py-3 px-5 text-white bg-theme-dark text rounded-full mx-auto">
                    Get Started
                </button>
                <div className="w-[90%] border mt-2 border-theme-dark"></div>
                <div className="text-lg md:text-3xl font-light text-center">
                    Empowering Web2 developers to transition into Web3 with our AI-driven platform. <br/>Describe your
                    needs,
                    and our AI will handle the rest.
                </div>
            </div>

            <div className="bg-theme-off-white-light rounded-xl p-10 w-full mt-24">
                <div className="w-full text-center text-4xl mb-10" id="agents"><span>Choose an agent</span></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {agentData.map((agent, index) => (
                        <AgentCard key={index} agent={agent}/>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default App;