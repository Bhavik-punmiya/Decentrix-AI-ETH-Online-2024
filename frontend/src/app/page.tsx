"use client";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/contexts/UserContext";


function App() {
  const {userData, setUserData} = useContext(GlobalContext);

  return (
      <main className="w-full min-h-screen">
          <div className=" w-full h-screen px-5 flex flex-col justify-center  items-center gap-8 ">
              <div className="text-6xl mx-auto text-center">Think <span className="">Ideas</span>, Not Code.</div>
              <button className="py-3 px-5 text-white bg-theme-gray-dark text rounded-full mx-auto">
                  Get Started
              </button>
              <div className="w-[80%] border mt-2 border-theme-gray-dark"></div>
              <div className="text-3xl font-light w-1/2 text-center ">
                  Empower Web2 developers to transition into Web3 with our AI-driven platform. Describe your needs, and
                  our AI will handle the rest.
              </div>


          </div>

      </main>);
}

export default App;