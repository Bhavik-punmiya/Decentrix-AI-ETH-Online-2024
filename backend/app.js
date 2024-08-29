// app.js

const express = require('express');
const cors = require('cors');
const app = express();
const compilerRoutes = require('./routes/compilerRoutes');

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Use compiler routes
app.use('/api', compilerRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
