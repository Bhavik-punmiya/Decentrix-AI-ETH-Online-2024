import { ethers } from "hardhat";
import readline from "readline";

async function main() {
    const contractABI =   [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "initialOracleAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "knowledgeBaseCID",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "chatId",
                        "type": "uint256"
                    }
                ],
                "name": "ChatCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "newOracleAddress",
                        "type": "address"
                    }
                ],
                "name": "OracleAddressUpdated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "runId",
                        "type": "uint256"
                    }
                ],
                "name": "addMessage",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "chatRuns",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "messagesCount",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "chatId",
                        "type": "uint256"
                    }
                ],
                "name": "getMessageHistory",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "role",
                                "type": "string"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "string",
                                        "name": "contentType",
                                        "type": "string"
                                    },
                                    {
                                        "internalType": "string",
                                        "name": "value",
                                        "type": "string"
                                    }
                                ],
                                "internalType": "struct IOracle.Content[]",
                                "name": "content",
                                "type": "tuple[]"
                            }
                        ],
                        "internalType": "struct IOracle.Message[]",
                        "name": "",
                        "type": "tuple[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "knowledgeBase",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "runId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string[]",
                        "name": "documents",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "name": "onOracleKnowledgeBaseQueryResponse",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "runId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "response",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "name": "onOracleLlmResponse",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "oracleAddress",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "newOracleAddress",
                        "type": "address"
                    }
                ],
                "name": "setOracleAddress",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    }
                ],
                "name": "startChat",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];

    if (!process.env.CHAT_GPT_CONTRACT_ADDRESS) {
        throw new Error("CHAT_GPT_CONTRACT_ADDRESS env variable is not set.");
    }

    const contractAddress = process.env.CHAT_GPT_CONTRACT_ADDRESS;
    const [signer] = await ethers.getSigners();

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Start a new chat
    const initialMessage = await getUserInput("Enter your first message to start the chat: ");
    console.log("Starting chat...");
    const tx = await contract.startChat(initialMessage);
    console.log("Waiting for transaction to be mined...");
    const receipt = await tx.wait();
    console.log(`Transaction hash: ${receipt.hash}`);
    console.log(`Explorer: https://explorer.yournetwork.com/tx/${receipt.hash}`);

    const event = receipt.events?.find((event: { event: string; }) => event.event === 'ChatCreated');
    const chatId = event?.args[1].toNumber();

    console.log(`Chat started with ID: ${chatId}`);

    // Loop to continue the conversation
    while (true) {
        try {
            // Get the message history
            const messageHistory = await contract.getMessageHistory(chatId);
            console.log("\nChat History:");
            messageHistory.forEach((message: any) => {
                console.log(`${message.role}: ${message.content[0].value}`);
            });

            // Get the next message from the user
            const nextMessage = await getUserInput("\nEnter your next message (or 'exit' to end the chat): ");
            if (nextMessage.toLowerCase() === 'exit') {
                break;
            }

            // Add the message to the chat
            console.log("Sending message...");
            const addMessageTx = await contract.addMessage(nextMessage, chatId);
            console.log("Waiting for transaction to be mined...");
            await addMessageTx.wait();
            console.log("Message sent. Waiting for response...");

            // Wait for the assistant's response (you might need to implement a polling mechanism here)
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds (adjust as needed)
        } catch (error) {
            console.error("An error occurred:", error);
            break;
        }
    }

    console.log("Chat ended. Thank you for using ChatGpt!");
}

async function getUserInput(prompt: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });