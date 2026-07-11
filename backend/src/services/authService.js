import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { storage } from '../storage/store.js';

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const attachUserMethods = (user) => ({
  ...user,
  async matchPassword(passwordToMatch) {
    return comparePassword(passwordToMatch, this.password);
  },
  getPublicProfile() {
    const publicUser = { ...this };
    delete publicUser.password;
    delete publicUser.googleId;
    return publicUser;
  },
});

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, university, branch, semester } = userData;

  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email already registered');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const user = await storage.saveUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    university,
    branch,
    semester,
    role: 'student',
    isVerified: false,
    isActive: true,
  });

  return attachUserMethods(user);
};

export const loginUser = async (email, password) => {
  const user = await storage.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  return attachUserMethods(user);
};

export const verifyGoogleToken = async (profile) => {
  let user = await storage.getUserByEmail(profile.email);

  if (!user) {
    user = await storage.saveUser({
      firstName: profile.given_name || profile.name?.split(' ')[0],
      lastName: profile.family_name || profile.name?.split(' ')[1] || '',
      email: profile.email,
      googleId: profile.id,
      profileImage: profile.picture,
      isVerified: true,
      role: 'student',
      isActive: true,
    });
  }

  return attachUserMethods(user);
};

export const updateUserProfile = async (userId, updates) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'bio', 'university', 'branch', 'semester', 'profileImage'];

  const filteredUpdates = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const user = await storage.updateUser(userId, filteredUpdates);
  return attachUserMethods(user);
};
