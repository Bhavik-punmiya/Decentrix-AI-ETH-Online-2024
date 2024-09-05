import React from 'react';
import { Input, Button, Accordion, AccordionItem } from '@nextui-org/react';
import { useContractState } from '@/contexts/ContractContext';

const ContractInteraction = () => {
  const { contractState } = useContractState();
  const abi = contractState.abi;

  const renderInputs = (inputs) => {
    if (inputs.length === 0) {
      return <p>No input parameters</p>;
    }
    return inputs.map((input, index) => (
      <Input key={index} label={`${input.name} (${input.type})`} placeholder={`Enter ${input.name}`} />
    ));
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

  const renderFunction = (func) => {
    const inputs = func.inputs || [];
    const buttonColor = getButtonColor(func.stateMutability);
    return (
      <AccordionItem key={func.name} title={func.name}>
        <div className="space-y-2">
          {renderInputs(inputs)}
          <Button color={buttonColor}>
            {func.stateMutability === "view" ? "Call" : "Transact"}
          </Button>
        </div>
      </AccordionItem>
    );
  };

  if (!abi) {
    return <p>No ABI available. Please compile or load a contract first.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contract Interaction</h2>
      <Accordion>
        {abi.filter(item => item.type === "function").map(renderFunction)}
      </Accordion>
    </div>
  );
};

export default ContractInteraction;