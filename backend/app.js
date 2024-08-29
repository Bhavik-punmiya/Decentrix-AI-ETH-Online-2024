const express = require('express');
const bodyParser = require('body-parser');
const solidityRoutes = require('./routes/compilerRoutes');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the Solidity routes
app.use('/api', solidityRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
