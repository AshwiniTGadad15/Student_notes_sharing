import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, university, branch, semester } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    university,
    branch,
    semester,
  });

  await user.save();
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  return user;
};

export const verifyGoogleToken = async (profile) => {
  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    user = new User({
      firstName: profile.given_name || profile.name?.split(' ')[0],
      lastName: profile.family_name || profile.name?.split(' ')[1] || '',
      email: profile.email,
      googleId: profile.id,
      profileImage: profile.picture,
      isVerified: true,
    });
    await user.save();
  }

  return user;
};

export const updateUserProfile = async (userId, updates) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'bio', 'university', 'branch', 'semester', 'profileImage'];

  const filteredUpdates = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  return user;
};
