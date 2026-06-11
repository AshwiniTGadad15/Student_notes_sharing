import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email'],
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  profileImage: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  university: {
    type: String,
    trim: true,
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'],
    default: 'OTHER',
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'moderator'],
    default: 'student',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  uploadedNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
    },
  ],
  downloads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Download',
    },
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (passwordToMatch) {
  return await bcrypt.compare(passwordToMatch, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.googleId;
  return user;
};

// Add index for email searches
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

export default mongoose.model('User', userSchema);
