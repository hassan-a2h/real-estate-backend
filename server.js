import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnection from './db/config.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//  Middlewares used
app.use(cors());
app.use(express.json());

//  Initializing connection to MongoDB
dbConnection();

//  Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
