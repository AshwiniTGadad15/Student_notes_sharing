import express from 'express';
import { register, login, googleAuth, getProfile, updateProfile, getUserById, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest, validateRegister, validateLogin } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, validateRegister, validateRequest, register);
router.post('/login', authLimiter, validateLogin, validateRequest, login);
router.post('/google', googleAuth);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/user/:id', getUserById);
router.post('/logout', authenticate, logout);

export default router;
