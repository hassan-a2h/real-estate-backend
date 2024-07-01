import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import { io } from '../server.js'; // Import the io instance from server.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const getChat = async (req, res) => {
  const { userId, agentId, listingId, propertyTitle } = req.body;

  try {
    let chat = await Chat.findOne({ userId, agentId });

    if (!chat) {
      chat = new Chat({ userId, agentId, listingIds: [listingId] });
      await chat.save();

      const initialMessage = new Message({
        chatId: chat._id,
        senderId: userId,
        receiverId: agentId,
        message: listingId,
        isPropertyTitle: true
      });
      await initialMessage.save();
    } else if (!chat.listingIds.includes(listingId)) {
      chat.listingIds.push(listingId);
      await chat.save();

      const initialMessage = new Message({
        chatId: chat._id,
        senderId: userId,
        receiverId: agentId,
        message: propertyTitle,
        isPropertyTitle: true
      });
      await initialMessage.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserChats = async (req, res) => {
  const { id } = req.params;

  try {
    // const chats = await Chat.find({ $or: [{ userId: id }, { agentId: id }] }).populate('listingIds');

    const chats = await Chat.aggregate([
      { $match: { $or: [{ userId: new mongoose.Types.ObjectId(id) }, { agentId: new mongoose.Types.ObjectId(id) }] } },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'chatId',
          as: 'messages'
        }
      },
      {
        $unwind: {
          path: '$messages',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: {
          'messages.createdAt': -1
        }
      },
      {
        $group: {
          _id: '$_id',
          chat: { $first: '$$ROOT' },
          lastMessage: { $first: '$messages' }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$chat', { lastMessage: '$lastMessage' }]
          }
        }
      },
      {
        $sort: {
          'lastMessage.createdAt': -1
        }
      }
    ]);

    res.status(200).json(chats);
  } catch (error) {
    console.log('chat fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  const { userId, lastMessageDate, limit = 20 } = req.query;
  const receiverId = userId;

  try {
    let query = { chatId };
    if (lastMessageDate) {
      query.createdAt = { $lt: new Date(lastMessageDate) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    let unreadMessagesUpdated = false;

    // Update isRead status for messages intended for the logged-in user
    for (let message of messages) {
      if (message?.receiverId?.toString() === receiverId && !message.isRead) {
        message.isRead = true;
        await message.save();
        unreadMessagesUpdated = true;
      }
    }

    if (unreadMessagesUpdated) {
      // Emit an event to notify about the updated unread count
      io.emit('unreadCountUpdated', { userId: receiverId });
    }
    
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMessage = async (req, res) => {
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
};

export const readOneMessage = async (req, res) => {
  const { id } = req.body;

  try {
    const message = await Message.findById(id);
    message.isRead = true;
    await message.save();
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  };
};

export const getUnreadCount = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all messages where receiverId matches userId and isRead is false
    const unreadMessages = await Message.find({
      receiverId: userId,
      isRead: false
    });

    const unreadChats = {};

    for (let message of unreadMessages) {
      if (!unreadChats[message.chatId]) {
        unreadChats[message.chatId] = 1;
      } else {
        unreadChats[message.chatId]++;
      }
    }

    res.status(200).json({ unreadCount: Object.keys(unreadChats).length, unreadChats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};