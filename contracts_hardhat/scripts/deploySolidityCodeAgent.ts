import { ethers } from "hardhat";

async function main() {
    if (!process.env.ORACLE_ADDRESS) {
        throw new Error("ORACLE_ADDRESS env variable is not set.");
    }
    const oracleAddress: string = process.env.ORACLE_ADDRESS;
    const systemPrompt: string = "you are an intelligent  agent for developing smart contracts, Please generate a Solidity smart contract based on the user instructions"; // Replace with your desired system prompt

    await deploySolidityCodeAgent(oracleAddress, systemPrompt);
}

async function deploySolidityCodeAgent(oracleAddress: string, systemPrompt: string) {
    const agent = await ethers.deployContract("SolidityCodeAgent", [oracleAddress, systemPrompt], {});

    await agent.waitForDeployment();

    console.log(`Agent contract deployed to ${agent.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});