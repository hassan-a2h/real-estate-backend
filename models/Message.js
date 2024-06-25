import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isRead: { type: Boolean, default: false },
  message: { type: String, required: true, maxLength: 512 },
  isPropertyTitle: { type: Boolean, default: false }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);