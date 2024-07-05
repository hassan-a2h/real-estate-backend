import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnection from './db/config.js';
import authRoutes from './routes/authRoutes.js';
import listingsRoutes from './routes/listingsRoutes.js';
import socialsRoutes from './routes/socialRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messagesSocket from './sockets/messagesHandler.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: '*', // Or specify allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    host: '0.0.0.0',
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 3000;

//  Middlewares used

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Initializing connection to MongoDB
dbConnection();

// Set up a connection event
messagesSocket(io);

//  Routes
app.use('/api/users', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/socials', socialsRoutes);
app.use('/api/c', chatRoutes);

app.get('/', (req, res) => {
  res.send('<h1>API is running...</h1>');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});

app.get('/*', (req, res) => {
  return res.status(404).json({ message: '404 request no recognized' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
