"use client";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/UserContext";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import Image from "next/image";

function App() {
    const { userData, setUserData } = useContext(GlobalContext);

    return (
        <main className="w-full px-10">
            <div className="w-full px-5 pt-36 flex flex-col justify-center items-center gap-8">
                <div className="text-4xl md:text-6xl mx-auto text-center">Think <span className="">Ideas</span>, Not Code.</div>
                <button onClick={() => {
                    //scroll to agents section
                    // @ts-ignore
                    document.getElementById("agents").scrollIntoView({ behavior: "smooth" });
                }} className="py-3 px-5 text-white bg-theme-dark text rounded-full mx-auto">
                    Get Started
                </button>
                <div className="w-[90%] border mt-2 border-theme-dark"></div>
                <div className="text-lg md:text-3xl font-light text-center">
                    Empowering Web2 developers to transition into Web3 with our AI-driven platform. <br />Describe your needs,
                    and our AI will handle the rest.
                </div>
            </div>

            <div className="bg-theme-off-white-light rounded-xl p-10 w-full mt-24">
                <div className="w-full text-center text-4xl mb-10" id="agents"><span>Choose an agent</span></div>

                {/* Grid for initial 6 agents */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {/* Rootstock Agent */}
                    <div className="bg-theme-green-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Image src="/chain/rootstock-logo.png" alt="rootstock" width={40} height={40}/>
                                <div className="text-xl text-center font-bold">Rootstock</div>
                            </div>
                            <Link href={"/agent/rootstock/chat"}
                                  className="text-2xl p-2 rounded-xl bg-theme-green-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane/>
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            Rootstock is the top and oldest running Bitcoin Layer 2 Blockchain, fully EVM compatible.
                        </div>
                    </div>

                    {/* Hedera Agent */}
                    <div className="bg-theme-purple-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Image src="/chain/hedera-logo.png" alt="hedera" width={30} height={30}/>
                                <div className="text-xl text-center font-bold">Hedera</div>
                            </div>
                            <Link href={"/agent/hedera/chat"}
                                  className="text-2xl p-2 rounded-xl bg-theme-purple-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane/>
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            An open-source, public network governed by leading organizations around the world.
                        </div>
                    </div>

                    {/* Blockless Agent */}
                    <div className="bg-theme-gray-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Image src="/chain/blockless-logo.png" alt="blockless" width={40} height={40}
                                       className="rounded-full mr-2"/>
                                <div className="text-xl text-center font-bold">Blockless</div>
                            </div>
                            <Link href={"/agent/blockless/chat"}
                                  className="text-2xl p-2 rounded-xl bg-theme-gray-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane/>
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            Blockless is the infrastructure platform to launch, integrate, and secure Network Neutral Applications (nnApps).
                        </div>
                    </div>

                    {/* Morph Agent */}
                    <div className="bg-theme-gray-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Image src="/chain/morph-logo.jpeg" className="rounded-full" alt="morph" width={30}
                                       height={30}/>
                                <div className="text-xl text-center font-bold">Morph</div>
                            </div>
                            <Link href={"/agent/morph/chat"}
                                  className="text-2xl p-2 rounded-xl bg-theme-gray-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane/>
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            Morph is a blockchain platform focused on seamless asset exchanges and decentralized finance solutions.
                        </div>
                    </div>

                    {/* Nilion Agent */}
                    <div className="bg-theme-green-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Image src="/chain/nillion-logo.png" className="rounded-full" alt="nillion" width={40}
                                       height={40}/>
                                <div className="text-xl text-center font-bold">Nilion</div>
                            </div>
                            <Link href={"/agent/nillion/chat"}
                                  className="text-2xl p-2 rounded-xl bg-theme-green-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane/>
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            Nilion is a blockchain network designed for secure and scalable decentralized applications.
                        </div>
                    </div>

                    {/* Nethermind Agent */}
                    <div className="bg-theme-purple-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-4">
                                <Image src="/chain/nethermind-logo.png" className="rounded-full" alt="nethermind"
                                       width={35} height={35}/>
                                <div className="text-xl text-center font-bold">Nethermind</div>
                            </div>
                            <Link href={"/agent/nethermind/chat"}
                                  className="text-2xl p-2 rounded-xl bg-theme-purple-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane/>
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            Nethermind is a blockchain development company that provides Ethereum infrastructure and tools.
                        </div>
                    </div>
                </div>

                {/* Flex container for the last 2 agents */}
                <div className="flex justify-center items-center mt-10 gap-7">
                    {/* Chainlink Agent */}
                    <div className="bg-theme-blue-light rounded-xl shadow-lg p-5 w-80">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image src="/chain/chainlink-logo.png" alt="chainlink" width={40} height={40} />
                                <div className="text-xl text-center font-bold">Chainlink</div>
                            </div>
                            <Link href={"/agent/chainlink/chat"}
                                className="text-2xl p-2 rounded-xl bg-theme-blue-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane />
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            Chainlink is the most widely used oracle network for powering hybrid smart contracts.
                        </div>
                    </div>

                    {/* Fhenix Agent */}
                    <div className="bg-theme-orange-light rounded-xl shadow-lg p-5 w-80">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image src="/chain/fhenix-logo.png" alt="fhenix" width={40} height={40} />
                                <div className="text-xl text-center font-bold">Fhenix</div>
                            </div>
                            <Link href={"/agent/fhenix/chat"}
                                className="text-2xl p-2 rounded-xl bg-theme-orange-dark text-white hover:scale-110 ease-out transition-all">
                                <FaTelegramPlane />
                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3">
                            Fhenix is a scalable blockchain platform designed for Web3 innovation and development.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
