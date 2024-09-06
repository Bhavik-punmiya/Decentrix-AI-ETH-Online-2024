import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';
import { getContractsForUser } from '@/lib/contractService';

const DashboardPage = () => {
  const [userContracts, setUserContracts] = useState([]);
  const [userId, setUserId] = useState('hardcodedUserId'); // Replace with actual user ID later

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const contracts = await getContractsForUser(userId);
        setUserContracts(contracts);
      } catch (error) {
        console.error("Error fetching user contracts:", error);
      }
    };

    fetchContracts();
  }, [userId]);

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Image
              src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${userId}`}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">Welcome, User!</h1>
              <p className="text-gray-600">User ID: {userId}</p>
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
                  href={`/contract/${contract.contractAddress}`}
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