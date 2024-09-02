import { useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from 'ethers';
import SolidityCodeAgentABI from '@/utils/SolidityCodeAgentABI.json';
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { MetamaskAdapter } from "@web3auth/metamask-adapter";

type UseSolidityCodeAgentContract = {
    code: string;
    setCode: (code: string) => void;
    suggestions: string | null;
    loading: boolean;
    error: string | null;
    isErrorModalOpen: boolean;
    handleCloseErrorModal: () => void;
    handleRunAgent: (prompt: string, isImprovementPrompt: boolean) => void;
    setError: (error: string) => void;
    progressMessage: string;
    setSuggestions: (suggestions: string | null) => void;
    handleOpenErrorModal: (message: string) => void;
};

export function useSolidityCodeAgentContract(): UseSolidityCodeAgentContract {
    const [code, setCode] = useState('');
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>('');

    const codeReviewMessages = useMemo(() => [
        'Analyzing your code...',
        'Identifying code improvement suggestions...',
        'Evaluating best coding practices...',
        'Inspecting for potential bugs...',
        'Optimizing gas usage...',
    ], []);

    const codeImprovementMessages = useMemo(() => [
        'Reviewing your code...',
        'Identifying areas for enhancement...',
        'Making requested changes...',
        'Finalizing the review...',
    ], []);

    const handleOpenErrorModal = (message: string) => {
        setError(message);
        setIsErrorModalOpen(true);
    };

    const handleCloseErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    useEffect(() => {
        const initWeb3Auth = async () => {
            const web3auth = new Web3Auth({
                clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
                chainConfig: {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: '0x1',
                    rpcTarget: 'https://rpc.ankr.com/eth',
                },
            });

            const metamaskAdapter = new MetamaskAdapter({
                chainConfig: {
                    chainNamespace: CHAIN_NAMESPACES.EIP155,
                    chainId: '0x1',
                    rpcTarget: 'https://rpc.ankr.com/eth',
                },
            });

            web3auth.configureAdapter(metamaskAdapter);

            setWeb3Auth(web3auth);
            const provider = await web3auth.connect();
            setProvider(provider);
        };

        initWeb3Auth();
    }, []);

    const signer = provider?.getSigner();
    const contractAddress = process.env.NEXT_PUBLIC_SOLIDITY_CODE_AGENT_CONTRACT_ADDRESS ?? '';
    console.log('contractAddress', contractAddress);

    const contract = useMemo(() => {
        if (provider) {
            return new ethers.Contract(contractAddress, SolidityCodeAgentABI, signer);
        }
    }, [contractAddress, provider, signer]);

    const runAgent = useCallback(async (query: string, maxIterations: number) => {
        const tx = await contract?.runAgent(query, maxIterations);
        const receipt = await tx.wait();
        const event = receipt.events?.find((event: { event: string; }) => event.event === 'AgentRunCreated');
        return event.args[1].toNumber();
    }, [contract]);

    const getMessageHistoryContents = useCallback(async (agentId: number) => {
        return await contract?.getMessageHistoryContents(agentId);
    }, [contract]);

    const isRunFinished = useCallback(async (runId: number) => {
        return await contract?.isRunFinished(runId);
    }, [contract]);

    const handleRunAgent = useCallback(async (prompt: string, isImprovementPrompt: boolean) => {
        if (!provider) {
            handleOpenErrorModal('Please connect your wallet');
            return;
        }
        if (!prompt) {
            handleOpenErrorModal('Please enter some code.');
            return;
        }

        const maxIterations = 10;

        const codeImprovementQuery = `
        Please review and modify the following Solidity code as per the instructions provided within the comments marked with '@Genie:'. Only make changes where specified by these '@Genie' instructions. Do not alter any other parts of the code.

        Instructions:
        ${prompt}

        Solidity code:
        ${suggestions}
        `;

        const codeReviewQuery = `
            Please review the following Solidity code as an expert smart contract researcher. Your review should be detailed and organized into the following sections:
                
            1. **Code Improvement Suggestions**: Provide specific suggestions to improve the code quality.
            2. **Best Practices**: Highlight the best practices that should be followed.
            3. **Potential Bugs**: Identify any potential bugs in the code.
            4. **Gas Optimization**: Suggest ways to optimize gas usage.
                
            After providing the feedback, include the revised version of the code with all recommended changes applied. Do not use any markdown formatting for the code.
                
            Solidity code:
            ${prompt}
            `;

        const query = isImprovementPrompt ? codeImprovementQuery : codeReviewQuery;
        const messages = isImprovementPrompt ? codeImprovementMessages : codeReviewMessages;

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

    }, [codeImprovementMessages, codeReviewMessages, getMessageHistoryContents, isRunFinished, runAgent, suggestions, provider]);

    return {
        code,
        setCode,
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