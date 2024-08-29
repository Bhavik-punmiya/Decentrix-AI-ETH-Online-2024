// controllers/compilerController.js

const solc = require('solc');

exports.compileSolidity = (req, res) => {
    const sourceCode = req.body.code;

    // Prepare input for solc
    const input = {
        language: 'Solidity',
        sources: {
            'Contract.sol': {
                content: sourceCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode']
                }
            }
        }
    };

    // Compile the Solidity code
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for compilation errors or warnings
    if (output.errors && output.errors.length > 0) {
        return res.status(400).json({
            status: 'error',
            errors: output.errors.map(err => ({
                type: err.severity,
                message: err.formattedMessage || err.message
            }))
        });
    }

    const compiledContract = output.contracts['Contract.sol'];
    const bytecode = compiledContract['ContractName'].evm.bytecode.object;
    const abi = compiledContract['ContractName'].abi;

    res.json({
        status: 'success',
        bytecode,
        abi
    });
};
