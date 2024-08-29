// routes/compilerRoutes.js

const express = require('express');
const router = express.Router();
const compilerController = require('../controllers/compilerController');

// POST /compile - Compiles Solidity code and returns errors or success
router.post('/compile', compilerController.compileSolidity);

module.exports = router;
