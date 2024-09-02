import type {Metadata} from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WagmiProviderComp from "@/utils/wagmi-provider";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/utils/config";


export const metadata: Metadata = {
    title: "Decentrix.AI",
    description: "Think ideas, not code",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const initialState = cookieToInitialState(config, headers().get("cookie"));

    return (
        <html lang="en">
        <body className="bg-theme-off-white pt-20">
        <Providers>
            <Navbar/>
            <WagmiProviderComp initialState={initialState}>
                {children}
            </WagmiProviderComp>
            <Footer/>
        </Providers>
        </body>
        </html>
    );
}
