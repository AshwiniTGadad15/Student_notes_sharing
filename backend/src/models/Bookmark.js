import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to prevent duplicate bookmarks
bookmarkSchema.index({ noteId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
