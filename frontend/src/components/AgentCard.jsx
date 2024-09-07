import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCode } from 'react-icons/fa';
import { IoMdChatbubbles } from 'react-icons/io';

const AgentCard = ({ agent }) => {
    const {
        name,
        logo,
        description,
        backgroundColor,
        buttonColor,
        chatLink,
        codeLink
    } = agent;

    return (
        <div className={`${backgroundColor} rounded-xl shadow-lg p-5 flex flex-col justify-between`}>
            <div>
                <div className="flex w-full justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Image src={logo} className="rounded-full" alt={name} width={40} height={40}/>
                        <div className="text-xl text-center font-bold">{name}</div>
                    </div>
                </div>
                <div className="font-light text-lg mt-3">
                    {description}
                </div>
            </div>
            {codeLink && chatLink && (
                <div className="flex flex-row gap-2 items-center mt-4">
                    <Link
                        href={codeLink}
                        className={`text-2xl p-2 rounded-xl ${buttonColor} text-white hover:scale-110 ease-out transition-all`}
                        title={`Code on ${name}`}
                    >
                        <FaCode/>
                    </Link>
                    <Link
                        href={chatLink}
                        className={`text-2xl p-2 rounded-xl ${buttonColor} text-white hover:scale-110 ease-out transition-all`}
                        title={`Chat with ${name} agent`}
                    >
                        <IoMdChatbubbles/>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AgentCard;