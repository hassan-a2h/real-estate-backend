import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 64,
    minlength: 8,
  },
  description: {
    type: String,
    required: true,
    maxlength: 512,
  },
  price: {
    type: Number,
    required: true,
    min: 1000,
    max: 50000000,
  },
  location: {
    type: String,
    required: true,
    maxlength: 128,
    minlength: 8,
  },
  category: {
    type: String,
    enum: ['villa', 'home', 'apartment', 'building', 'office', 'townhouse', 'shop', 'garage'],
    required: true,
  },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'active' },
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;