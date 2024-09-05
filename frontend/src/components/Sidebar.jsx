"use client"
import React, { useState } from 'react';
import { FaHome, FaCode, FaRobot, FaUser, FaEthereum } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import { useContractState } from '@/contexts/ContractContext';
import ContractInteraction from '@/components/ContractInteractions';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const { contractState } = useContractState();
  const [activeIcon, setActiveIcon] = useState(null);
  const router = useRouter();

  const handleIconClick = (icon, path) => {
    if (icon === 'contract') {
      setActiveIcon(activeIcon === icon ? null : icon);
    } else {
      setActiveIcon(null);
      router.push(path);
    }
  };

  const SidebarIcon = ({ icon, path, iconName }) => (
    <div className="h-8 w-8 flex items-center justify-center m-4 rounded-md hover:bg-gray-200 focus:bg-gray-200">
      <Button
        auto
        color="transparent"
        onClick={() => handleIconClick(iconName, path)}
        className={`flex items-center justify-center }`}
      >
        {icon}
      </Button>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-white text-black shadow z-50">
      <SidebarIcon icon={<FaHome size="16" />} path="/" iconName="home" />
      <SidebarIcon icon={<FaCode size="16" />} path="/agent/rootstock/code" iconName="code" />
      <SidebarIcon icon={<FaRobot size="16" />} path="/agent/rootstock/chat" iconName="robot" />
      <SidebarIcon icon={<FaEthereum size="16" />}  iconName="contract" />
      <SidebarIcon icon={<FaUser size="16" />} path="/dashboard" iconName="user" />

      {activeIcon === 'contract' && (
        <NestedSidebar title="Contract Interaction">
          {contractState.isDeployed && contractState.abi ? (
            <div className="text-xs"> 
              <ContractInteraction />
            </div>
          ) : (
            <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <p className="font-bold">No Contracts Deployed Yet</p>
              <p className="mt-2">Please deploy a contract to interact with it.</p>
            </div>
          )}
        </NestedSidebar>
      )}

      {activeIcon === 'user' && (
        <NestedSidebar title="User">
          <Button auto color="primary">User Option 1</Button>
          <Button auto color="primary">User Option 2</Button>
        </NestedSidebar>
      )}
    </div>
  );
};

const NestedSidebar = ({ title, children }) => (
  <div className="absolute ml-16 top-0 h-screen w-[20vw] bg-white p-4 text-black shadow overflow-y-auto">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

export default Sidebar;