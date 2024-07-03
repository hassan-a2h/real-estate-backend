import { Message } from '../models/Message.js';

const messagesHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
  
    socket.on('messagesRead', ({ userId }) => {
      io.emit('unreadCountUpdated', { userId });
    });
  
    // Listen for messages and broadcast them
    socket.on('sendMessage', async (data) => {
      console.log('socket, message received:', data);
  
      try {
        // Save the message to the database
        const newMessage = new Message({ chatId: data.chatId, senderId: data.senderId, receiverId: data.receiverId, message: data.message });
        await newMessage.save();
  
        // Broadcast the saved message to all connected clients
        io.emit('receiveMessage', newMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });
};

export default messagesHandler;