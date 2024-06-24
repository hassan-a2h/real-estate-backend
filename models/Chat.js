import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
}, { timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);