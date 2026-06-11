import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  helpful: {
    type: Number,
    default: 0,
  },
  notHelpful: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to prevent duplicate ratings
ratingSchema.index({ noteId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
