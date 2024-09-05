import { ethers } from "hardhat";

async function main() {
    if (!process.env.ORACLE_ADDRESS) {
        throw new Error("ORACLE_ADDRESS env variable is not set.");
    }
    const oracleAddress: string = process.env.ORACLE_ADDRESS;
    const systemPrompt: string = "you are a helpful agent"; // Replace with your desired system prompt
    const knowledgeBaseCID: string = "QmbgmknoyrKuXccG75AW1pNNqBpikddHviwMvyk49KeRmw"; // Replace with your knowledge base CID

    await deployAgent(oracleAddress, systemPrompt, knowledgeBaseCID);
}

async function deployAgent(oracleAddress: string, systemPrompt: string, knowledgeBaseCID: string) {
    const agent = await ethers.deployContract("RootstockAgent", [oracleAddress, systemPrompt, knowledgeBaseCID], {});

    await agent.waitForDeployment();

    console.log(`Agent contract deployed to ${agent.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});