import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide note title'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: 1000,
  },
  subject: {
    type: String,
    required: [true, 'Please specify subject'],
    trim: true,
  },
  module: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  university: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'],
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'],
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  tags: [String],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'archived'],
    default: 'pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: {
    type: String,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  bookmarkCount: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
    },
  ],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      comment: String,
      rating: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  downloads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Download',
    },
  ],
  bookmarkedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for search and filtering
noteSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });
noteSchema.index({ category: 1, status: 1 });
noteSchema.index({ university: 1, branch: 1, semester: 1 });
noteSchema.index({ uploadedBy: 1 });
noteSchema.index({ status: 1 });

export default mongoose.model('Note', noteSchema);
