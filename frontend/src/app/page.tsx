"use client";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/contexts/UserContext";
import Link from "next/link";
import {FaTelegramPlane} from "react-icons/fa";
import Image from "next/image";


function App() {
    const {userData, setUserData} = useContext(GlobalContext);

    return (
        <main className="w-full px-10">
            <div className=" w-full  px-5 pt-36 flex flex-col justify-center  items-center gap-8 ">
                <div className="text-6xl mx-auto text-center">Think <span className="">Ideas</span>, Not Code.</div>
                <button onClick={()=>{
                   //scoll to agents section
                    // @ts-ignore
                    document.getElementById("agents").scrollIntoView({behavior: "smooth"});


                }} className="py-3 px-5 text-white bg-theme-dark text rounded-full mx-auto">
                    Get Started
                </button>
                <div className="w-[90%] border mt-2 border-theme-dark"></div>
                <div className="text-3xl font-light  text-center ">
                    Empowering Web2 developers to transition into Web3 with our AI-driven platform. <br/>Describe your needs,
                    and
                    our AI will handle the rest.
                </div>

            </div>

            <div className="bg-theme-off-white-light rounded-xl p-10 w-full mt-24 ">
                <div className="w-full text-center text-4xl mb-10" id="agents"><span>Choose an agent</span>
                </div>

                <div className="grid grid-cols-3 space-x-10  ">
                    <div className="bg-theme-purple-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Image src="/chain/rootstock-logo.png" alt="rootstock" width={40} height={40}/>
                                <div className=" text-xl text-center font-bold ">Rootstock</div>
                            </div>
                            <Link href={"/agent/rootstock"}
                                  className="text-2xl   p-2 rounded-xl bg-theme-purple-dark text-white hover:scale-110 ease-out transition-all"><FaTelegramPlane/>

                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3 ">
                            Rootstock is the top and oldest running Bitcoin Layer 2 Blockchain, fully EVM compatible.

                        </div>

                    </div>
                    <div className="bg-theme-green-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Image src="/chain/hedera-logo.png" alt="hedera" width={30} height={30}/>
                                <div className=" text-xl text-center font-bold ">Hedera</div>
                            </div>
                            <Link href={"/editor"}
                                  className="text-2xl   p-2 rounded-xl bg-theme-green-dark text-white hover:scale-110 ease-out transition-all"><FaTelegramPlane/>

                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3 ">
                            An open source, public network governed by leading organizations around the world.
                        </div>

                    </div>
                    <div className="bg-theme-gray-light rounded-xl shadow-lg p-5">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-1">
                                <Image src="/chain/kinto-logo.png" alt="kinto" width={40} height={40}/>
                                <div className=" text-xl text-center font-bold ">Kinto</div>
                            </div>
                            <Link href={"/agent/kinto"}
                                  className="text-2xl   p-2 rounded-xl bg-theme-gray-dark text-white hover:scale-110 ease-out transition-all"><FaTelegramPlane/>

                            </Link>
                        </div>
                        <div className="font-light text-lg mt-3 ">
                            Kinto is an L2 focused on providing safe access to on-chain finance.

                        </div>

                    </div>
                </div>
            </div>

        </main>);
}

export default App;