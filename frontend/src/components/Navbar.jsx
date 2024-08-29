"use client";
import {CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK} from "@web3auth/base";
import {EthereumPrivateKeyProvider} from "@web3auth/ethereum-provider";
import {Web3Auth} from "@web3auth/modal";
import {useEffect, useState} from "react";
import {useContext} from "react";
import {GlobalContext} from "@/contexts/UserContext";
import {FaBars, FaTimes} from "react-icons/fa";
import RPC from "./etherRPC";
import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";
import {usePathname} from "next/navigation";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";

const clientId = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID;
const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {chainConfig},
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider,
});

function Navbar() {
    const [provider, setProvider] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const {userData, setUserData} = useContext(GlobalContext);
    const [nameInitials, setNameInitials] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('/');
    const pathname = usePathname();

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);

                if (web3auth.connected) {
                    setLoggedIn(true);
                    const user_data = await web3auth.getUserInfo();
                    setUserData(user_data);
                    console.log("user_data", user_data);
                    const initials = user_data.name.split(' ').map((n) => n[0]).join('');
                    setNameInitials(initials);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const login = async () => {
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        if (web3auth.connected) {
            setLoggedIn(true);
            const user_data = await web3auth.getUserInfo();
            setUserData(user_data);
        }
    };

    const logout = async () => {
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
        setUserData(null);
    };

    // Check the RPC file for the implementation
    const getAccounts = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            return;
        }
        const address = await RPC.getAccounts(provider);
        console.log(address);
    };

    const getBalance = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            return;
        }
        const balance = await RPC.getBalance(provider);
        console.log(balance);
    };

    const signMessage = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            return;
        }
        const signedMessage = await RPC.signMessage(provider);
        console.log(signedMessage);
    };

    const sendTransaction = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            return;
        }
        console.log("Sending Transaction...");
        const transactionReceipt = await RPC.sendTransaction(provider);
        console.log(transactionReceipt);
    };

    useEffect(() => {

        //get current page url
        if (pathname) {
            setCurrentPage(pathname);
            console.log(pathname)
        }
        console.log("userData", userData)
    }, [pathname])

    return (
        <nav
            className="fixed top-3 left-1/2 transform -translate-x-1/2  p-2 w-[95%] z-10   rounded-full backdrop-blur-xl ">
            <div className=" mx-auto ">
                <div className="flex justify-between">
                    <div className="flex px-3">
                        <BrandLogo/>
                    </div>

                    <div className="hidden md:flex gap-2 items-center justify-center font-bold  ">

                        {/*login with world id*/}
                        {
                            loggedIn ? (
                                <div className='flex items-center space-x-4'>
                                    <Link href="/profile">
                                        {
                                            userData?.profileImage ? (
                                                <img
                                                    src={userData.profileImage}
                                                    alt="profile"
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div
                                                    className='w-8 h-8 bg-theme-blue-light font-bold rounded-full flex items-center justify-center'>
                                                    {nameInitials}
                                                </div>
                                            )
                                        }
                                    </Link>

                                    <button
                                        onClick={() => logout()}
                                        className=" py-2 px-4 text-white bg-theme-dark text rounded-full  "
                                    >Logout
                                    </button>
                                </div>
                            ) : <div>
                                <button
                                    onClick={() => login()}
                                    className=" py-2 px-4 text-white bg-theme-dark text rounded-full  "
                                >Login
                                </button>
                            </div>
                        }

                    </div>

                    <button
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="md:hidden px-4 "

                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FaTimes/> : <FaBars/>}
                    </button>
                </div>
                <div className="md:hidden my-2 bg-white">
                    {isMenuOpen && (<div
                        className=" text-center flex flex-col gap-2  border-t border-theme-blue-light py-2  font-bold">
                        <Link className=" py-1 hover:text-black text-gray-500" href="/agents">Explore Agents</Link>
                        {/*login with world id*/}
                        {
                            loggedIn ? (
                                <Link
                                    href="/profile"
                                    className=" mx-4 py-2 px-4 text-white bg-theme-dark text rounded-full  "
                                >Profile
                                </Link>
                            ) : (
                                <button
                                    onClick={() => login()}
                                    className=" mx-4 py-2 px-4 text-white bg-theme-dark text rounded-full  "
                                >Login</button>
                            )
                        }

                    </div>)}
                </div>

            </div>
        </nav>);

}

export default Navbar;