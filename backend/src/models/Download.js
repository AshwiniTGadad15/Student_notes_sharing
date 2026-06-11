import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
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
  downloadedAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
});

// Create compound index to prevent duplicate downloads
downloadSchema.index({ noteId: 1, userId: 1 });

export default mongoose.model('Download', downloadSchema);
