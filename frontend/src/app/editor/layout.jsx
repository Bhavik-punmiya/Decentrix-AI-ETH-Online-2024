import React from 'react';
// import SideBar from '@/components/SideBar'; // Ensure this path is correct

export default function EditorLayout({ children }) {
  return (
    <div className="min-h-screen ">
      {/* <SideBar /> */}
      <main className="">{children}</main>
    </div>
  );
}