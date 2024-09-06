# Contracts setup

## Setup

**Install dependencies**

```
cd contracts
cp template.env .env
npm install
```

Modify .env and add your private key for relevant network  
`PRIVATE_KEY_LOCALHOST` for local node
`PRIVATE_KEY_GALADRIEL` for Galadriel testnet

Rest of this README assumes you are in the `contracts` directory

## Deployment

### Deploy any contract

Get the [oracle address](https://docs.galadriel.com/oracle-address) from the docs and replace `<oracle address>` with
the address.  
Check the available example contracts in the [contracts](contracts) directory

**Compile the contracts**
```
npm run compile
```
**Deploy a contract**
```
npx hardhat deploy --network [network (galadriel or localhost)] --contract [contract name] --oracleaddress [oracle_address] [space separated extra constructor args]
```

### Example: Deploy Agent on Galadriel devnet
Update `.env`:

* Add your private key to `PRIVATE_KEY_GALADRIEL`

* Add the [oracle address](http://docs.galadriel.com/oracle-address) to `ORACLE_ADDRESS`

## Make sure you have written the script in package.json

```json
"deploySolidityCodeAgent": "npx hardhat run scripts/deploySolidityCodeAgent.ts --network galadriel",
```
**Deploy agent to Galadriel testnet**

```
npm run deployAgentWithKb
```

### Once deployed, copy the contract address..
### Update the .env with corresponding contract address
###


If your contract has any custom parameters or function names then the configuration at the start of your scripts need to be changed accordingly.

