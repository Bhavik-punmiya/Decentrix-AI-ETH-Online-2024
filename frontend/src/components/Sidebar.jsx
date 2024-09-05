"use client"
import React, { useState } from 'react';
import { FaHome, FaCode, FaRobot, FaUser, FaEthereum } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import { useContractState } from '@/contexts/ContractContext';
import ContractInteraction from '@/components/ContractInteractions';

const Sidebar = () => {
  const { contractState } = useContractState();
  const [activeIcon, setActiveIcon] = useState(null);

  const handleIconClick = (icon) => {
    setActiveIcon(activeIcon === icon ? null : icon);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-28 m-0 flex flex-col bg-white text-black shadow z-50">
      <SidebarIcon icon={<FaHome size="28" />} onClick={() => handleIconClick('home')} />
      <SidebarIcon icon={<FaCode size="28" />} onClick={() => handleIconClick('home')} />
      <SidebarIcon icon={<FaRobot size="28" />} onClick={() => handleIconClick('user')} />
      <SidebarIcon icon={<FaEthereum size="28" />} onClick={() => handleIconClick('settings')} />
      <SidebarIcon icon={<FaUser size="28" />} onClick={() => handleIconClick('chart')} />

      {activeIcon === 'home' && (
        <NestedSidebar title="Home">
          <Button auto color="primary">Home Option 1</Button>
          <Button auto color="primary">Home Option 2</Button>
        </NestedSidebar>
      )}
      
      {activeIcon === 'home' && (
        <NestedSidebar title="Home">
          <Button auto color="primary">Home Option 1</Button>
          <Button auto color="primary">Home Option 2</Button>
        </NestedSidebar>
      )}

      {activeIcon === 'user' && (
        <NestedSidebar title="User">
          <Button auto color="primary">User Option 1</Button>
          <Button auto color="primary">User Option 2</Button>
        </NestedSidebar>
      )}

      {activeIcon === 'chart' && (
        <NestedSidebar title="Chart">
          <Button auto color="primary">Chart Option 1</Button>
          <Button auto color="primary">Chart Option 2</Button>
        </NestedSidebar>
      )}

      {activeIcon === 'settings' && (
        <NestedSidebar title="Contract Interaction">
          {contractState.isCompiled && contractState.abi ? (
            <ContractInteraction />
          ) : (
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="font-bold">No Contracts Compiled Yet</p>
              <p className="mt-2">Please compile a contract to interact with it.</p>
            </div>
          )}
        </NestedSidebar>
      )}
    </div>
  );
};

const SidebarIcon = ({ icon, onClick }) => (
  <div className="h-16 w-16 flex items-center justify-center m-4 rounded-md hover:bg-gray-200 focus:bg-gray-200">
    <Button
      auto
      color="transparent"
      onClick={onClick}
      className="flex items-center justify-center text-black"
    >
      {icon}
    </Button>
  </div>
);

const NestedSidebar = ({ title, children }) => (
  <div className="absolute ml-28 top-0 h-screen w-[400px] bg-white p-4 text-black shadow overflow-y-auto">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

export default Sidebar;