import { ethers } from "hardhat";

async function main() {
    if (!process.env.ORACLE_ADDRESS) {
        throw new Error("ORACLE_ADDRESS env variable is not set.");
    }
    const oracleAddress: string = process.env.ORACLE_ADDRESS;
    const systemPrompt: string = "You are an AI assistant specializing in Nethermind blockchain and Cairo programming language and starknet. Your task is to provide accurate, concise, and helpful responses to user queries about Nethermind, Cairo programming language and Starknet,  using the knowledge base provided to you "; // Replace with your desired system prompt
    const knowledgeBaseCID: string = `QmWdiTsWuYosmEhKkVJVYgNDRgsc559cNo8cYmFjerEPcc`; // Replace with your knowledge base CID


    await deployAgent(oracleAddress, systemPrompt, knowledgeBaseCID);
}

async function deployAgent(oracleAddress: string, systemPrompt: string, knowledgeBaseCID: string) {
    const agent = await ethers.deployContract("NethermindAgent", [oracleAddress, systemPrompt, knowledgeBaseCID], {});

    await agent.waitForDeployment();

    console.log(`Agent contract deployed to ${agent.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});