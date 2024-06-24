import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnection from './db/config.js';
import authRoutes from './routes/authRoutes.js';
import listingsRoutes from './routes/listingsRoutes.js';
import socialsRoutes from './routes/socialRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { Message } from './models/Message.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 3000;

//  Middlewares used
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Initializing connection to MongoDB
dbConnection();

// Set up a connection event
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });

  // Listen for messages and broadcast them
  socket.on('sendMessage', async (data) => {
    console.log('socket, message received:', data);

    try {
      // Save the message to the database
      const newMessage = new Message({ chatId: data.chatId, senderId: data.senderId, message: data.message });
      await newMessage.save();

      // Broadcast the saved message to all connected clients
      io.emit('receiveMessage', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
});

//  Routes
app.use('/api/users', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/socials', socialsRoutes);
app.use('/api/c', chatRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
