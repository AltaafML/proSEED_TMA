import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import bot from './src/telegram/bot.js';  // Correct the path if necessary

dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);

const uri = process.env.MONGO_URI;  // Use environment variable
const dbName = 'proseed';

const client = new MongoClient(uri); // Removed deprecated options

client.connect()
  .then(() => {
    console.log('MongoDB Connected');

    // Define the fetchTelegramID route
    app.get('/api/fetchTelegramID', async (req, res) => {
      try {
        const telegramID = req.query.telegramId;
        const database = client.db(dbName);
        const users = database.collection('users');
        const user = await users.findOne({ telegramId: telegramID });

        if (user) {
          res.json({ telegramID: user.telegramId });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        console.error('Error fetching Telegram ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Other server routes and middleware
    app.use('/api', bot); // Assuming you have additional API routes defined in bot.js
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Listen on a different port (e.g., 3001)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;





