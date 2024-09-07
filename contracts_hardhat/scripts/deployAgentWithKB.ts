import { ethers } from "hardhat";

async function main() {
    if (!process.env.ORACLE_ADDRESS) {
        throw new Error("ORACLE_ADDRESS env variable is not set.");
    }
    const oracleAddress: string = process.env.ORACLE_ADDRESS;
    const systemPrompt: string = "You are an AI assistant specializing in Cairo programming language. Your task is to provide accurate, concise, and helpful responses to user queries about Cairo, starknet,  using the knowledge base provided to you "; // Replace with your desired system prompt
    const knowledgeBaseCID: string = `Qma4Jnagfczdx7iq8gJUyEBFoeFkqEMtPgo23hPXS5eWjH`; // Replace with your knowledge base CID


    await deployAgent(oracleAddress, systemPrompt, knowledgeBaseCID);
}

async function deployAgent(oracleAddress: string, systemPrompt: string, knowledgeBaseCID: string) {
    const agent = await ethers.deployContract("CairoCodeAgentWithKb", [oracleAddress, systemPrompt, knowledgeBaseCID], {});

    await agent.waitForDeployment();

    console.log(`Agent contract deployed to ${agent.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});