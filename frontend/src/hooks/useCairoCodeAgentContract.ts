import { useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from 'ethers';
import CairoCodeAgentABI from '../utils/CairoCodeAgentWithKb.json';

type UseCairoCodeAgentContract = {
    code: string;
    setCode: (code: string) => void;
    userPrompt: string;
    setUserPrompt: (prompt: string) => void;
    suggestions: string | null;
    loading: boolean;
    error: string | null;
    isErrorModalOpen: boolean;
    handleCloseErrorModal: () => void;
    handleRunAgent: (prompt: string) => void;
    setError: (error: string) => void;
    progressMessage: string;
    setSuggestions: (suggestions: string | null) => void;
    handleOpenErrorModal: (message: string) => void;
};

export function useCairoCodeAgentContract(): UseCairoCodeAgentContract {
    const [code, setCode] = useState('');
    const [userPrompt, setUserPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<string | null>("//Your cairo code will appear here");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [ethersProvider, setEthersProvider] = useState<ethers.providers.JsonRpcProvider | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>('');

    const codeGenerationMessages = useMemo(() => [
        'Generating code...',
        'Analyzing your instructions...',
        'Creating the smart contract...',
        'Finalizing the code...',
        "Almost there...",
    ], []);

    const handleOpenErrorModal = (message: string) => {
        setError(message);
        setIsErrorModalOpen(true);
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL_GALADRIEL);
        setEthersProvider(provider);
        console.log('Ethereum provider initialized');
    }, []);

    const wallet = useMemo(() => {
        if (ethersProvider && process.env.NEXT_PUBLIC_GALADRIEL_PRIVATEKEY) {
            const w = new ethers.Wallet(process.env.NEXT_PUBLIC_GALADRIEL_PRIVATEKEY, ethersProvider);
            console.log('Wallet initialized with address:', w.address);
            return w;
        }
    }, [ethersProvider]);

    const contractAddress = "0x1EBfc3650489873c0987E0760Bd2e7f953019750" ?? '';

    const contract = useMemo(() => {
        if (wallet) {
            const c = new ethers.Contract(contractAddress, CairoCodeAgentABI, wallet);
            console.log('Contract initialized at address:', contractAddress);
            return c;
        }
    }, [contractAddress, wallet]);

    const runAgent = useCallback(async (query: string, maxIterations: number) => {
        if (!contract) {
            console.error('Contract not initialized');
            throw new Error("Contract is not initialized");
        }
        // console.log('Running agent with query:', query);
        const tx = await contract.runAgent(query, maxIterations);
        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed in block:', receipt.blockNumber);
        const event = receipt.events?.find((event: { event: string; }) => event.event === 'AgentRunCreated');
        return event?.args[1].toNumber();
    }, [contract]);

    const getMessageHistoryContents = useCallback(async (agentId: number) => {
        if (!contract) {
            console.error('Contract not initialized');
            throw new Error("Contract is not initialized");
        }
        console.log('Getting message history for agent ID:', agentId);
        return await contract.getMessageHistoryContents(agentId);
    }, [contract]);

    const isRunFinished = useCallback(async (runId: number) => {
        if (!contract) {
            console.error('Contract not initialized');
            throw new Error("Contract is not initialized");
        }
        console.log('Checking if run is finished for run ID:', runId);
        return await contract.isRunFinished(runId);
    }, [contract]);

    const handleRunAgent = useCallback(async (prompt: string) => {
        if (!prompt) {
            handleOpenErrorModal('Please enter some prompt.');
            return;
        }

        const maxIterations = 10;

        const codeGenerationQuery = `
        Please generate a Cairo smart contract based on the following instructions. and the knowledge base provided to you about the cairo language.Provide only the code without any additional text, comments, or formatting at the start or end. The code should be ready to use in a Cairo smart contract editor. Start directly with the code and do not include any backticks or other information. Don't give anything other than the code,  Use Cairo syntax and conventions throughout the contract.
            dont add \" \`\`\`cairo\" at the beginning or at the end. dont add any other instructions at the end only give code .
        Make a cairo contract based on the following instructions and the knowledge base provided:
        ${prompt}
        `;

        const query = codeGenerationQuery;
        const messages = codeGenerationMessages;

        setLoading(true);
        setError(null);

        console.log('Starting agent run with prompt:', prompt);
        try {
            const runId = await runAgent(query, maxIterations);
            console.log('Agent run started with ID:', runId);

            let finished = false;
            let messageIndex = 0;

            while (!finished) {
                if (messageIndex < messages.length) {
                    setProgressMessage(messages[messageIndex]);
                    console.log('Progress:', messages[messageIndex]);
                    messageIndex++;
                }
                finished = await isRunFinished(runId);
                console.log('Run finished status:', finished);
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            const messageHistoryContents = await getMessageHistoryContents(runId);
            console.log('Message history retrieved');
            setSuggestions(messageHistoryContents[2]);
        } catch (error) {
            console.error('Error running agent:', error);
            handleOpenErrorModal('Error fetching suggestions');
        } finally {
            console.log('Agent run complete');
            setLoading(false);
            setProgressMessage('');
        }

    }, [codeGenerationMessages, getMessageHistoryContents, isRunFinished, runAgent]);

    return {
        code,
        setCode,
        userPrompt,
        setUserPrompt,
        suggestions,
        loading,
        error,
        isErrorModalOpen,
        handleCloseErrorModal,
        handleRunAgent,
        setError,
        progressMessage,
        setSuggestions,
        handleOpenErrorModal,
    };
}