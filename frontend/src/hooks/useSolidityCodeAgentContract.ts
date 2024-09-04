import { useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from 'ethers';
import SolidityCodeAgentABI from '../utils/SolidityCodeAgentABI.json';
import { useAccount, useWalletClient } from "wagmi";

type UseSolidityCodeAgentContract = {
    code: string;
    setCode: (code: string) => void;
    userPrompt: string;
    setUserPrompt: (prompt: string) => void;
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
    const [userPrompt, setUserPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>('');

    const { isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();


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
        if (isConnected) {
            console.log('Wallet connected:');
        }
    }, [isConnected]);

    useEffect(() => {
        if (walletClient) {
            const provider = new ethers.providers.Web3Provider(walletClient.transport, "any");
            setEthersProvider(provider);
        }
    }, [walletClient]);


    const signer = ethersProvider?.getSigner();
    const contractAddress = process.env.NEXT_PUBLIC_SOLIDITY_CODE_AGENT_CONTRACT_ADDRESS ?? '';

    const contract = useMemo(() => {
        if (ethersProvider && signer) {
            return new ethers.Contract(contractAddress, SolidityCodeAgentABI, signer);
        }
    }, [contractAddress, ethersProvider, signer]);

    const runAgent = useCallback(async (query: string, maxIterations: number) => {
        const tx = await contract?.runAgent(query, maxIterations);
        const receipt = await tx.wait();
        const event = receipt.events?.find((event: { event: string; }) => event.event === 'AgentRunCreated');
        return event?.args[1].toNumber();
    }, [contract]);

    const getMessageHistoryContents = useCallback(async (agentId: number) => {
        return await contract?.getMessageHistoryContents(agentId);
    }, [contract]);

    const isRunFinished = useCallback(async (runId: number) => {
        return await contract?.isRunFinished(runId);
    }, [contract]);

    const handleRunAgent = useCallback(async (prompt: string) => {
        if (!isConnected) {
            handleOpenErrorModal('Please connect your wallet');
            return;
        }
        if (!prompt) {
            handleOpenErrorModal('Please enter some prompt.');
            return;
        }

        const maxIterations = 10;


        const codeGenerationQuery = `
        Please generate a Solidity smart contract based on the following instructions. Provide only the code without any additional text, comments, or formatting at the start or end. The code should be ready to use in a smart contract editor. Start directly with the code and do not include any backticks or other information. make sure to include SPDX license identifier at the top of the file. dont give any thing other that tne code, starting from spdx license identifier to the end of the code.

        Instructions:
        ${prompt}
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
            // /run comipler
            // if(error){
            //     runErrorAgent();
            // }
            setLoading(false);
            setProgressMessage('');
        }

    }, [codeGenerationMessages, getMessageHistoryContents, isRunFinished, runAgent, suggestions, isConnected]);

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