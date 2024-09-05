import readline from "readline";
const { ethers } = require("hardhat");

async function main() {
    const contractABI =
        [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "initialOracleAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "systemPrompt",
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
                    "name": "runId",
                    "type": "uint256"
                }
            ],
            "name": "AgentRunCreated",
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
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "agentRuns",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "responsesCount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint8",
                    "name": "max_iterations",
                    "type": "uint8"
                },
                {
                    "internalType": "bool",
                    "name": "is_finished",
                    "type": "bool"
                },
                {
                    "internalType": "string",
                    "name": "code",
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
                    "name": "agentId",
                    "type": "uint256"
                }
            ],
            "name": "getMessageHistoryContents",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "agentId",
                    "type": "uint256"
                }
            ],
            "name": "getMessageHistoryRoles",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
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
                }
            ],
            "name": "isRunFinished",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
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
                    "internalType": "string",
                    "name": "response",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "errorMessage",
                    "type": "string"
                }
            ],
            "name": "onOracleFunctionResponse",
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
                    "components": [
                        {
                            "internalType": "string",
                            "name": "id",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "content",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "functionName",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "functionArguments",
                            "type": "string"
                        },
                        {
                            "internalType": "uint64",
                            "name": "created",
                            "type": "uint64"
                        },
                        {
                            "internalType": "string",
                            "name": "model",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "systemFingerprint",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "object",
                            "type": "string"
                        },
                        {
                            "internalType": "uint32",
                            "name": "completionTokens",
                            "type": "uint32"
                        },
                        {
                            "internalType": "uint32",
                            "name": "promptTokens",
                            "type": "uint32"
                        },
                        {
                            "internalType": "uint32",
                            "name": "totalTokens",
                            "type": "uint32"
                        }
                    ],
                    "internalType": "struct IOracle.OpenAiResponse",
                    "name": "response",
                    "type": "tuple"
                },
                {
                    "internalType": "string",
                    "name": "errorMessage",
                    "type": "string"
                }
            ],
            "name": "onOracleOpenAiLlmResponse",
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
            "inputs": [],
            "name": "prompt",
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
                    "internalType": "string",
                    "name": "_code",
                    "type": "string"
                },
                {
                    "internalType": "uint8",
                    "name": "max_iterations",
                    "type": "uint8"
                }
            ],
            "name": "runAgent",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
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
        }
    ]

    if (!process.env.SOLIDITY_CODE_AGENT_CONTRACT_ADDRESS) {
        throw new Error(
            "SOLIDITY_CODE_AGENT_CONTRACT_ADDRESS env variable is not set."
        );
    }

    const contractAddress = process.env.SOLIDITY_CODE_AGENT_CONTRACT_ADDRESS;
    const [signer] = await ethers.getSigners();

    const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );

    const solidityCode = await getUserInput();
    const maxIterations = 10; // Replace with your desired max iterations

    const transactionResponse = await contract.runAgent(
        solidityCode,
        maxIterations
    );
    const receipt = await transactionResponse.wait();
    console.log(`Transaction sent, hash: ${receipt.hash}.`);

    const runId = await transactionResponse.value;
    console.log(`Agent run started with ID: ${runId}`);

    while (true) {
        const isFinished = await contract.isRunFinished(runId);
        if (isFinished) {
            break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const contents = await contract.getMessageHistoryContents(runId);
    const roles = await contract.getMessageHistoryRoles(runId);

    console.log("Message History:");
    for (let i = 0; i < contents.length; i++) {
        console.log(`Role: ${roles[i]}, Content: ${contents[i]}`);
    }
}

async function getUserInput(): Promise<string | undefined> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = (query: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(query, (answer) => {
                resolve(answer);
            });
        });
    };

    try {
        const input = await question("Enter your Solidity code: ");
        rl.close();
        return input;
    } catch (err) {
        console.error("Error getting user input:", err);
        rl.close();
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });