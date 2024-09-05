import {useState, useCallback, useEffect, useMemo} from "react";
import {ethers} from 'ethers';
import SolidityCodeAgentABI from '../utils/SolidityCodeAgentABI.json';
import {useAccount, useWalletClient} from "wagmi";

type UseRootstockCodeAgentContract = {
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

export function useRootstockCodeAgentContract(): UseRootstockCodeAgentContract {
    const [code, setCode] = useState('');
    const [userPrompt, setUserPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>('');

    const {isConnected} = useAccount();
    const {data: walletClient} = useWalletClient();


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
    const contractAddress = process.env.NEXT_PUBLIC_ROOTSTOCK_AGENT_CONTRACT_ADDRESS ?? '';

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
            You are an AI assistant specializing in Rootstock blockchain technology. Your task is to provide accurate, concise, and helpful responses to user queries about Rootstock, using the knowledge base provided to you. Please follow these guidelines:
            
            1. Analyze the user's question carefully: "${prompt}"
            2. Use the provided knowledge base to formulate your response.
            3. If the question relates to code or implementation, provide relevant code snippets or examples.
            4. Give links to official documentation or other resources where appropriate.
            
            Remember to use the knowledge base provided and avoid using any external information, your goal is to assist users in understanding and working with Rootstock technology effectively. Tailor your response to best address the user's specific needs and level of expertise.
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