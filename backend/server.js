const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'build')));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// Listen on the specified port or port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for Vercel's serverless functions
module.exports = app;

