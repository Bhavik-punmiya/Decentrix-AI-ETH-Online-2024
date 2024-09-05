"use client"
import React, { useState } from 'react';
import { FaHome, FaCode, FaRobot, FaUser, FaEthereum } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import { useContractState } from '@/contexts/ContractContext';
import ContractInteraction from '@/components/ContractInteractions';
import { useRouter } from 'next/navigation';
import {BsChatDotsFill} from "react-icons/bs";

const Sidebar = () => {
    const { contractState } = useContractState();
    const [activeIcon, setActiveIcon] = useState(null);
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const router = useRouter();

    const handleIconClick = (icon, path) => {
        if (icon === 'contract') {
            setActiveIcon(activeIcon === icon ? null : icon);
        } else {
            setActiveIcon(null);
            router.push(path);
        }
    };

    const SidebarIcon = ({ icon, path, iconName, label }) => (
        <div
            className="relative h-8 w-8 flex items-center justify-center m-4 rounded-md hover:bg-gray-200 focus:bg-gray-200"
            onMouseEnter={() => setHoveredIcon(iconName)}
            onMouseLeave={() => setHoveredIcon(null)}
        >
            <Button
                auto
                color="transparent"
                onClick={() => handleIconClick(iconName, path)}
                className="flex items-center justify-center"
                title={label}
            >
                {icon}
            </Button>
            {hoveredIcon === iconName && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                    {label}
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-white text-black shadow z-50">
            <SidebarIcon icon={<FaHome size="20" />} path="/" iconName="home" label="Home" />
            <SidebarIcon icon={<FaCode size="20" />} path="/agent/rootstock/code" iconName="code" label="Code" />
            <SidebarIcon icon={<BsChatDotsFill size="20" />} path="/agent/rootstock/chat" iconName="robot" label="Chat" />
            <SidebarIcon icon={<FaEthereum size="20" />} iconName="contract" label="Contract" />
            <SidebarIcon icon={<FaUser size="20" />} path="/dashboard" iconName="user" label="User" />

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