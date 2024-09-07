import { useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from 'ethers';
import SolidityCodeAgentABI from '../utils/SolidityCodeAgentABI.json';

type UseNethermindCodeAgentContract = {
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

export function useNethermindCodeAgentContract(): UseNethermindCodeAgentContract {
    const [code, setCode] = useState('');
    const [userPrompt, setUserPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [progressMessage, setProgressMessage] = useState<string>('');

    const codeGenerationMessages = useMemo(() => [
        'Understanding your question...',
        'Retrieving knowledge base...',
        'Finding answers...',
        'Generating answers...',
        "Almost there...",
    ], []);

    const handleOpenErrorModal = (message: string) => {
        setError(message);
        setIsErrorModalOpen(true);
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    const provider = useMemo(() => {
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL_GALADRIEL;
        if (!rpcUrl) {
            console.error('RPC URL is not defined');
            return null;
        }
        return new ethers.providers.JsonRpcProvider(rpcUrl);
    }, []);

    const signer = useMemo(() => {
        const privateKey = process.env.NEXT_PUBLIC_GALADRIEL_PRIVATEKEY;
        if (!privateKey || !provider) {
            console.error('Private key is not defined or provider is not available');
            return null;
        }
        return new ethers.Wallet(privateKey, provider);
    }, [provider]);

    const contractAddress = "0x79aF5729E7b8768681f2FD4Ae343eB1567459C80";

    const contract = useMemo(() => {
        if (signer) {
            return new ethers.Contract(contractAddress, SolidityCodeAgentABI, signer);
        }
    }, [contractAddress, signer]);

    const runAgent = useCallback(async (query: string, maxIterations: number) => {
        if (!contract) {
            throw new Error('Contract is not initialized');
        }
        const tx = await contract.runAgent(query, maxIterations);
        const receipt = await tx.wait();
        const event = receipt.events?.find((event: { event: string; }) => event.event === 'AgentRunCreated');
        return event?.args[1].toNumber();
    }, [contract]);

    const getMessageHistoryContents = useCallback(async (agentId: number) => {
        if (!contract) {
            throw new Error('Contract is not initialized');
        }
        return await contract.getMessageHistoryContents(agentId);
    }, [contract]);

    const isRunFinished = useCallback(async (runId: number) => {
        if (!contract) {
            throw new Error('Contract is not initialized');
        }
        return await contract.isRunFinished(runId);
    }, [contract]);

    const handleRunAgent = useCallback(async (prompt: string) => {
        if (!prompt) {
            handleOpenErrorModal('Please enter some prompt.');
            return;
        }

        const maxIterations = 10;

        const codeGenerationQuery = `
            You are an AI assistant specializing in Nethermind blockchain technology. Your task is to provide accurate, concise, and helpful responses to user queries about Nethermind, using the knowledge base provided to you. Please follow these guidelines:
            
            1. Analyze the user's question carefully: "${prompt}"
            2. Use the provided knowledge base to formulate your response.
            3. If the question relates to code or implementation, provide relevant code snippets or examples.
            4. Give links to official documentation or other resources at the end of your answer.
            5. if user didn't provide any context, use the knowledge base to generate a response.
             never tell the user to "google it" or "look it up".   . 

            
            Remember to use the knowledge base provided and avoid using any external information, your goal is to assist users in understanding and working with Nethermind technology effectively. Tailor your response to best address the user's specific needs and level of expertise.
            `;
        const query = codeGenerationQuery;
        const messages = codeGenerationMessages;

        setLoading(true);
        setError(null);

        console.log('Running agent...');
        try {
            const runId = await runAgent(query, maxIterations);
            console.log('Agent run started:');
            console.log('Run ID:', runId);

            let finished = false;
            let messageIndex = 0;

            while (!finished) {
                if (messageIndex < messages.length) {
                    setProgressMessage(messages[messageIndex]);
                    messageIndex++;
                }
                finished = await isRunFinished(runId);
                console.log('Run finished:', finished);
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
            const messageHistoryContents = await getMessageHistoryContents(runId);
            console.log('Message history contents:', messageHistoryContents);
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