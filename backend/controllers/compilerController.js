const multer = require('multer');
const solc = require('solc');
const fs = require('fs');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage location

const compileSolidity = (req, res) => {
    // Handle the uploaded file
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        status: 'error',
        success: 0,
        errors: [{ type: 'error', message: 'No file uploaded' }],
      });
    }
  
    // Read the Solidity source code from the uploaded file
    fs.readFile(file.path, 'utf8', (err, sourceCode) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          success: 0,
          errors: [{ type: 'error', message: 'Error reading file' }],
        });
      }
  
      // Prepare input for solc
      const input = {
        language: 'Solidity',
        sources: {
          'Contract.sol': {
            content: sourceCode,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['abi', 'evm.bytecode'],
            },
          },
        },
      };
  
      try {
        // Compile the Solidity code
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
        let success = 1; // Assume success by default
  
        // Check for compilation errors or warnings
        if (output.errors && output.errors.length > 0) {
          success = 0; // Set to 0 if there are errors
          return res.status(200).json({
            status: 'error',
            success,
            errors: output.errors.map(err => ({
              type: err.severity,
              message: err.formattedMessage || err.message,
            })),
          });
        }
  
        const compiledContract = output.contracts['Contract.sol'];
        const contractName = Object.keys(compiledContract)[0]; // Dynamically get the contract name
        const contractData = compiledContract[contractName];
  
        const bytecode = contractData.evm.bytecode.object;
        const abi = contractData.abi;
  
        const response_body = {
          status: 'success',
          success,
          bytecode,
          abi,
        };
  
        console.log(response_body);
        return res.status(200).json(response_body);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: 'error',
          success: 0,
          errors: [{
            type: 'error',
            message: error.message,
          }],
        });
      } finally {
        // Clean up uploaded file
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    });
  };
  

module.exports = {
  compileSolidity,
  upload, // Export the multer instance for use in the route
};
