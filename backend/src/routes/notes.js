import express from 'express';
import {
  uploadNote,
  getNoteById,
  searchNotesEndpoint,
  getRecommendationsEndpoint,
  downloadNote,
  bookmarkNote,
  rateNote,
  getApprovedNotes,
  deleteNote,
} from '../controllers/noteController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest, validateCreateNote, validateRating, validateObjectId, validateSearch } from '../middleware/validation.js';
import { upload, uploadToCloudinary } from '../utils/fileUpload.js';
import { uploadLimiter, searchLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/upload', authenticate, uploadLimiter, upload.single('file'), validateCreateNote, validateRequest, uploadNote);
router.get('/search', validateSearch, validateRequest, searchLimiter, searchNotesEndpoint);
router.get('/recommendations', authenticate, searchLimiter, getRecommendationsEndpoint);
router.get('/user/notes/approved', authenticate, getApprovedNotes);
router.get('/:id', validateObjectId, validateRequest, getNoteById);
router.get('/:id/download', authenticate, validateObjectId, validateRequest, downloadNote);
router.post('/:id/bookmark', authenticate, validateObjectId, validateRequest, bookmarkNote);
router.post('/:id/rate', authenticate, validateObjectId, validateRating, validateRequest, rateNote);
router.delete('/:id', authenticate, validateObjectId, validateRequest, deleteNote);

export default router;
