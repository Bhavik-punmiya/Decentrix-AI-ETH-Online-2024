const express = require('express');
const router = express.Router();
const { compileSolidity, upload } = require('../controllers/compilerController');

// Define the route for compiling Solidity code
router.post('/compile', upload.single('file'), compileSolidity);

module.exports = router;
