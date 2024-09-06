import React from 'react';
import Image from "next/image";
import Link from "next/link";

function BrandLogo(props) {
    return (
        <Link href="/" className="flex gap-2 flex-row items-center justify-center  py-1">
            <Image
                src="/img/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="w-auto h-8 rounded-xl overflow-clip"
            />
            <div
                className=" text-theme-blue-dark text-xl font-bold"

            >Decentrix.AI
            </div>
        </Link>

    );
}

export default BrandLogo;