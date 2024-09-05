"use client";
import React, { createContext, useState, useContext } from 'react';

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contractState, setContractState] = useState({
    abi: null,
    bytecode: null,
    isCompiled: false,
  });

  return (
    <ContractContext.Provider value={{ contractState, setContractState }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractState = () => useContext(ContractContext);