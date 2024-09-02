import React from 'react';
// import SideBar from '@/components/SideBar'; // Ensure this path is correct

export default function EditorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <SideBar /> */}
      <main className="p-4">{children}</main>
    </div>
  );
}