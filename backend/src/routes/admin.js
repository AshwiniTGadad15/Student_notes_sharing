import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPendingNotes,
  approveNoteEndpoint,
  rejectNoteEndpoint,
  getAdminStats,
  getAllUsers,
  deleteUser,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Category routes
router.get('/categories', getCategories);
router.post('/categories', authenticate, authorize('admin'), createCategory);
router.put('/categories/:id', authenticate, authorize('admin'), validateObjectId, validateRequest, updateCategory);
router.delete('/categories/:id', authenticate, authorize('admin'), validateObjectId, validateRequest, deleteCategory);

// Admin routes
router.get('/notes/pending', authenticate, authorize('admin'), getPendingNotes);
router.post('/notes/:id/approve', authenticate, authorize('admin'), validateObjectId, validateRequest, approveNoteEndpoint);
router.post('/notes/:id/reject', authenticate, authorize('admin'), validateObjectId, validateRequest, rejectNoteEndpoint);
router.get('/stats', authenticate, authorize('admin'), getAdminStats);
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.delete('/users/:id', authenticate, authorize('admin'), validateObjectId, validateRequest, deleteUser);

export default router;
