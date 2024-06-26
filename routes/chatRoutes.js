// routes/chatRoutes.js
import express from 'express';
const router = express.Router();
import { getChat, getUserChats, getChatMessages, createMessage, readOneMessage, getUnreadCount } from '../controllers/chatController.js';

// Create or get existing chat
router.post('/chat', getChat);

// Get user or agent chats
router.get('/chats/:id', getUserChats);

// Get chat messages
router.get('/chats/:chatId/messages', getChatMessages);

// Send message
router.post('/messages', createMessage);

router.post('/messages/read', readOneMessage);

// Get unread messages count for a user
router.get('/unread-messages/:userId', getUnreadCount);

export default router;
