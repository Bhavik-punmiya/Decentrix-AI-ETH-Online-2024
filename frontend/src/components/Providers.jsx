"use client";
import {GlobalProvider} from "@/contexts/UserContext";

require('dotenv').config();
export default function Providers({children}) {
    return (

            <GlobalProvider>
                {children}
            </GlobalProvider>
    )
}