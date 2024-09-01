"use client";
import {GlobalProvider} from "@/contexts/UserContext";
import {NextUIProvider} from "@nextui-org/react";

require('dotenv').config();
export default function Providers({children}) {
    return (
        
            <GlobalProvider>
                <NextUIProvider>
                {children}
                </NextUIProvider>
            </GlobalProvider>
    )
}