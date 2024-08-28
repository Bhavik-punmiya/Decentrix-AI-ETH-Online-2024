import type {Metadata} from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
    title: "Decentrix.AI",
    description: "Think ideas, not code",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="pt-14">
        <Providers>
            <Navbar/>
            {children}
            <Footer/>
        </Providers>
        </body>
        </html>
    );
}
