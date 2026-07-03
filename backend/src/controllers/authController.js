import { asyncHandler } from '../middleware/errorHandler.js';
import { generateToken, registerUser, loginUser, updateUserProfile } from '../services/authService.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import { createNotification } from '../services/notificationService.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const register = asyncHandler(async (req, res) => {
  // If MongoDB is not connected, return a clear 503 so frontend can surface it
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database not connected' });
  }

  const user = await registerUser(req.body);

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.firstName);
  } catch (error) {
    console.error('Email send error:', error);
  }

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: user.getPublicProfile(),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: user.getPublicProfile(),
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const user = req.user;
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Google authentication successful',
    token,
    user: user.getPublicProfile(),
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
    .populate('bookmarks', 'title subject fileUrl createdAt')
    .populate('uploadedNotes', 'title status')
    .populate('ratings');

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user.userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.getPublicProfile(),
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -googleId')
    .populate('uploadedNotes');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
