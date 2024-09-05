import React from 'react';
import Link from "next/link";

function SecondaryNavbar(props) {
    return (
            <div className=" mx-auto mt-3  py-2 px-4 w-fit z-40   rounded-full flex gap-5 bg-white shadow-lg">
                <Link href="/agent/rootstock/code">
                    Code
                </Link>
                <Link href="/agent/rootstock/chat">
                    Chat
                </Link>

            </div>
    );
}

export default SecondaryNavbar;