"use client";
import React, { useState, useEffect, useContext } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { getContractsForUser } from '@/lib/contractService';
import { GlobalContext } from "@/contexts/UserContext";

//RootStock Address Format :  https://explorer.testnet.rootstock.io/address/0x8244081ed3825d3a3498888d6b90529159fb94c1



const DashboardPage = () => {
  const [userContracts, setUserContracts] = useState([]);
  const { userData } = useContext(GlobalContext);
  const [nameInitials, setNameInitials] = useState('');

  useEffect(() => {
    if (userData && userData.email) {
      const fetchContracts = async () => {
        try {
          const contracts = await getContractsForUser(userData.email);
          setUserContracts(contracts);
        } catch (error) {
          console.error("Error fetching user contracts:", error);
        }
      };

      fetchContracts();

      // Set name initials
      if (userData.name) {
        const initials = userData.name.split(' ').map((n) => n[0]).join('');
        setNameInitials(initials);
      }
    }
  }, [userData]);

  if (!userData) {
    return <div className="p-8 min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-2xl font-bold">Please log in to view your dashboard.</p>
    </div>;
  }

  return (
    <div className="p-8 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            {userData.profileImage ? (
              <Image
                src={userData.profileImage}
                alt="User Avatar"
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-theme-purple-light rounded-full flex items-center justify-center text-2xl font-bold">
                {nameInitials}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{userData.name || 'Welcome!'}</h1>
              <p className="text-gray-600">{userData.email}</p>
              {userData.verifier && <p className="text-sm text-gray-500">Verified by: {userData.verifier}</p>}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Your Deployed Contracts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userContracts.map((contract, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-5">
              <div className="flex w-full justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Image
                    src="/chain/rootstock-logo.png"
                    alt="blockchain"
                    width={30}
                    height={30}
                  />
                  <div className="text-xl font-bold">
                    {contract.chainId === 31 ? 'Rootstock' : 'Unknown Chain'}
                  </div>
                </div>
                <Link
                  href={`${contract.blockExplorerUrl}`}
                  className="text-2xl p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FaTelegramPlane />
                </Link>
              </div>
              <div className="font-light text-sm mb-2">
                Address: {contract.contractAddress.slice(0, 10)}...
                {contract.contractAddress.slice(-8)}
              </div>
              <div className="font-light text-sm">
                Deployed on: {new Date().toLocaleDateString()} {/* Replace with actual deployment date if available */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;