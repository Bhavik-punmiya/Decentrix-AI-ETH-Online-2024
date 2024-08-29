

import React from 'react';
import AIChat from '../components/AIChat'; // Ensure this path is correct

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 p-4 bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to Solidity Editor</h1>
        <p className="mt-4">This is the left side of the page where you can add additional content.</p>
        <AIChat /> {/* Render AIChat component here */}
      </div>
      
      <div className="w-2/3 p-4 bg-transparent">
        {/* Other components or content */}
      </div>
    </div>
  );
}