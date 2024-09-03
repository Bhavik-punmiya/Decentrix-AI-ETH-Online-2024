import { useState, useCallback, useEffect, useMemo } from "react";
import { ethers } from 'ethers';
import SolidityFixCodeAgentABI from '../utils/SolidityFixCodeAgentABI.json';
import { useAccount, useWalletClient } from "wagmi";
import {undefined} from "zod";

type UseSolidityFixCodeAgentContract = {
    fixedCode: string | null;
    fixing: boolean;
    handleRunFixAgent: (compilationError: string, code:string) => void;
    fixingMessages: string;
    setFixedCode: (fixedCode: string | null) => void;
    setCompilationError: (compilationError: string | null) => void;
};

export function useSolidityFixCodeAgentContract(): UseSolidityFixCodeAgentContract {
    const [compilationError, setCompilationError] = useState<string | null>(null);
    const [fixedCode, setFixedCode] = useState<string | null>(null);
    const [fixing, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [ethersProvider, setEthersProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [fixingMessages, setProgressMessage] = useState<string>('');

    const { isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();


    const codeFixingMessages = useMemo(() => [
        'Analysing erros...',
      'Searching online for solutions...',
        'Applying fixes...',
        'Finalizing code...',
        'Almost done...',
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
    const contractAddress = process.env.NEXT_PUBLIC_SOLIDITY_FIX_CODE_AGENT_CONTRACT_ADDRESS ?? '';

    const contract = useMemo(() => {
        if (ethersProvider && signer) {
            return new ethers.Contract(contractAddress, SolidityFixCodeAgentABI, signer);
        }
    }, [contractAddress, ethersProvider, signer]);

    const runFixAgent = useCallback(async (query: string, maxIterations: number) => {
        const tx = await contract?.runFixAgent(query, maxIterations);
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

    const handleRunFixAgent = useCallback(async (code:string) => {
        if (!isConnected) {
            handleOpenErrorModal('Please connect your wallet');
            return;
        }
        if (!compilationError) {
            handleOpenErrorModal('Please give error.');
            return;
        }

        const maxIterations = 10;


        const codeFixQuery = `
        Please fix the following solidity code using the comipilation errors provided below:
         
        Current Code: 
        ${code}
        Errors:
        ${compilationError}
        
        Provide only the code without any additional text, comments, or formatting at the start or end. The code should be ready to use in a smart contract editor. Start directly with the code and do not include any backticks or other information. make sure to include SPDX license identifier at the top of the file. dont give any thing other that tne code, starting from spdx license identifier to the end of the code.
      
        `;

        const query = codeFixQuery;
        const messages = codeFixingMessages;

        setLoading(true);
        setError(null);

        console.log('Running agent...');
        try {
            const runId = await runFixAgent(query, maxIterations);
            console.log('Fixer Agent run started:');
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
            setFixedCode(messageHistoryContents[2]);
        } catch (error) {
            console.error('Error running agent:', error);
            handleOpenErrorModal('Error fetching fixedCode');
        } finally {
            console.log('Agent run complete');
            // /run comipler
            // if(error){
            //     runErrorAgent();
            // }
            setLoading(false);
            setProgressMessage('');
        }

    }, [codeFixingMessages, getMessageHistoryContents, isRunFinished, runFixAgent, fixedCode, isConnected]);

    return {
       fixedCode,
        fixing,
        handleRunFixAgent,
        setCompilationError,
        fixingMessages,
        setFixedCode
    };
}