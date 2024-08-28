"use client";
import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "@/contexts/UserContext";


function App() {
  const {userData, setUserData} = useContext(GlobalContext);

  return (
    <div className="container">


      <div className="grid">hello</div>


    </div>
  );
}

export default App;