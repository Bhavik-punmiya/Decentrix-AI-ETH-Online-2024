import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@xyrusworx/hardhat-solidity-json";
import 'solidity-docgen';
import "./tasks/whitelist";
import "./tasks/deploy";
import "./tasks/e2e";
import "./tasks/functions";
import "@nomicfoundation/hardhat-verify";

require('dotenv').config()
const galadrielDevnet = []
if (process.env.PRIVATE_KEY_GALADRIEL) {
  galadrielDevnet.push(process.env.PRIVATE_KEY_GALADRIEL)
}
const localhostPrivateKeys = []
if (process.env.PRIVATE_KEY_LOCALHOST) {
  localhostPrivateKeys.push(process.env.PRIVATE_KEY_LOCALHOST)
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true  // Enable the IR optimization to work around the "Stack too deep" error
    }
  },
  networks: {
    galadriel: {
      chainId: 696969,
      url: "https://devnet.galadriel.com/",
      accounts: galadrielDevnet,
    },
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      chainId: 1337,
      url: "http://127.0.0.1:8545",
      accounts: localhostPrivateKeys,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: "galadriel",
        chainId: 696969,
        urls: {
          apiURL: "https://devnet.galadriel.com/",
          browserURL: "https://explorer.galadriel.com//"
        }
      }
    ]

  },

};

export default config;