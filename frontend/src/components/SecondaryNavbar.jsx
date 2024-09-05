"use client";
import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function SecondaryNavbar() {
    const pathname = usePathname();
    const isActive = (path) => pathname.endsWith(path);

    return (
        <div className="mx-auto mt-3 py-2 px-4 w-fit z-40 rounded-full flex gap-5 bg-white shadow-lg font-bold">
            <Link href="/agent/rootstock/code" className={` rounded-full px-4 py-2 transition-colors duration-200 ${isActive('code') ? 'bg-theme-purple-dark text-white  font-bold' : 'text-gray-600 hover:bg-theme-purple-light'}`}>
                Code
            </Link>
            <Link href="/agent/rootstock/chat" className={` rounded-full px-4 py-2 transition-colors duration-200 ${isActive('chat') ? 'bg-theme-purple-dark text-white  font-bold' : 'text-gray-600 hover:bg-theme-purple-light'}`}>
                Chat
            </Link>
        </div>
    );
}