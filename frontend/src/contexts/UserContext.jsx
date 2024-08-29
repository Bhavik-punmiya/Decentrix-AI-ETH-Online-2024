import { createContext, useState } from 'react';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [userData, setUserData] = useState({});
    const [selectedChain, setSelectedChain] = useState(null);

    return (
        <GlobalContext.Provider value={{ userData, setUserData, selectedChain, setSelectedChain }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalProvider, GlobalContext };