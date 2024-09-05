"use client"
import React, { useState } from 'react';
import { Input, Button, Accordion, AccordionItem } from '@nextui-org/react';
import { useContractState } from '@/contexts/ContractContext';
import { ethers } from 'ethers';

const ContractInteraction = () => {
  const { contractState } = useContractState();
  const { abi, address } = contractState;
  const [results, setResults] = useState({});

  const renderInputs = (inputs, functionName) => {
    if (inputs.length === 0) {
      return <p>No input parameters</p>;
    }
    return inputs.map((input, index) => (
      <Input 
        key={`${functionName}-${index}`}
        label={`${input.name} (${input.type})`}
        placeholder={`Enter ${input.name}`}
        size="sm"
        className="mb-2"
        onChange={(e) => handleInputChange(functionName, index, e.target.value)}
      />
    ));
  };

  const handleInputChange = (functionName, index, value) => {
    setResults(prev => ({
      ...prev,
      [functionName]: {
        ...prev[functionName],
        inputs: {
          ...(prev[functionName]?.inputs || {}),
          [index]: value
        }
      }
    }));
  };

  const getButtonColor = (stateMutability) => {
    switch (stateMutability) {
      case 'payable':
        return 'danger';
      case 'view':
        return 'success';
      default:
        return 'warning';
    }
  };

  const callFunction = async (func) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, abi, signer);

      const inputs = results[func.name]?.inputs || {};
      const args = Object.values(inputs);

      let result;
      if (func.stateMutability === 'view') {
        result = await contract[func.name](...args);
      } else {
        const tx = await contract[func.name](...args);
        await tx.wait();
        result = 'Transaction successful';
      }

      setResults(prev => ({
        ...prev,
        [func.name]: {
          ...prev[func.name],
          result: result.toString()
        }
      }));
    } catch (error) {
      console.error('Error calling function:', error);
      setResults(prev => ({
        ...prev,
        [func.name]: {
          ...prev[func.name],
          result: 'Error: ' + error.message
        }
      }));
    }
  };

  const renderFunction = (func) => {
    const inputs = func.inputs || [];
    const buttonColor = getButtonColor(func.stateMutability);
    return (
      <AccordionItem key={func.name} title={func.name}>
        <div className="space-y-2">
          {renderInputs(inputs, func.name)}
          <Button color={buttonColor} size="sm" onClick={() => callFunction(func)}>
            {func.stateMutability === "view" ? "Call" : "Transact"}
          </Button>
          {results[func.name]?.result && (
            <div className="mt-2">
              <strong>Result:</strong> {results[func.name].result}
            </div>
          )}
        </div>
      </AccordionItem>
    );
  };

  if (!abi || !address) {
    return <p>No contract deployed. Please deploy a contract first.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contract Interaction</h2>
      <p className="mb-2"><strong>Contract Address:</strong> {address}</p>
      <Accordion>
        {abi.filter(item => item.type === "function").map(renderFunction)}
      </Accordion>
    </div>
  );
};

export default ContractInteraction;