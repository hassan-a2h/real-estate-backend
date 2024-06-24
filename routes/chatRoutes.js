// routes/chatRoutes.js
import express from 'express';
import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { io } from '../server.js'; // Import the io instance from server.js

const router = express.Router();

// Create or get existing chat
router.post('/chat', async (req, res) => {
  const { userId, agentId, listingId, propertyTitle } = req.body;

  try {
    let chat = await Chat.findOne({ userId, agentId });

    if (!chat) {
      chat = new Chat({ userId, agentId, listingIds: [listingId] });
      await chat.save();

      const initialMessage = new Message({
        chatId: chat._id,
        senderId: userId,
        message: propertyTitle,
        isPropertyTitle: true
      });
      await initialMessage.save();
    } else if (!chat.listingIds.includes(listingId)) {
      chat.listingIds.push(listingId);
      await chat.save();

      const initialMessage = new Message({
        chatId: chat._id,
        senderId: userId,
        message: propertyTitle,
        isPropertyTitle: true
      });
      await initialMessage.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user or agent chats
router.get('/chats/:id', async (req, res) => {
  const { id } = req.params;
  console.log('chat routes, id:', id);

  try {
    const chats = await Chat.find({ $or: [{ userId: id }, { agentId: id }] }).populate('listingIds');
    res.status(200).json(chats);
  } catch (error) {
    console.log('chat fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chat messages
router.get('/chats/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/messages', async (req, res) => {
  const { chatId, senderId, message } = req.body;

  try {
    const newMessage = new Message({ chatId, senderId, message });
    await newMessage.save();

    // Emit the new message to all connected clients
    io.emit('receiveMessage', newMessage);

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
