import { asyncHandler } from '../middleware/errorHandler.js';
import Category from '../models/Category.js';
import Note from '../models/Note.js';
import User from '../models/User.js';
import { getNotesForAdmin, approveNote as approveNoteService, rejectNote as rejectNoteService } from '../services/noteService.js';
import { sendNoteApprovedEmail, sendNoteRejectedEmail } from '../services/emailService.js';
import { createNotification } from '../services/notificationService.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });

  res.status(200).json({
    success: true,
    categories,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, color } = req.body;

  const category = new Category({
    name,
    description,
    icon,
    color,
  });

  await category.save();

  res.status(201).json({
    success: true,
    message: 'Category created',
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Category updated',
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Category deleted',
  });
});

// Admin controllers
export const getPendingNotes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await getNotesForAdmin(parseInt(page), parseInt(limit), 'pending');

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const approveNoteEndpoint = asyncHandler(async (req, res) => {
  const note = await approveNoteService(req.params.id, req.user.userId);

  // Send email to uploader
  const uploader = await User.findById(note.uploadedBy);
  try {
    await sendNoteApprovedEmail(uploader.email, note.title);
  } catch (error) {
    console.error('Email send error:', error);
  }

  // Create notification
  await createNotification(
    note.uploadedBy,
    'note_approved',
    'Note Approved',
    `Your note "${note.title}" has been approved!`,
    note._id
  );

  res.status(200).json({
    success: true,
    message: 'Note approved',
    note,
  });
});

export const rejectNoteEndpoint = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  const note = await rejectNoteService(req.params.id, rejectionReason);

  // Send email to uploader
  const uploader = await User.findById(note.uploadedBy);
  try {
    await sendNoteRejectedEmail(uploader.email, note.title, rejectionReason);
  } catch (error) {
    console.error('Email send error:', error);
  }

  // Create notification
  await createNotification(
    note.uploadedBy,
    'note_rejected',
    'Note Rejected',
    `Your note "${note.title}" was rejected. Reason: ${rejectionReason}`,
    note._id
  );

  res.status(200).json({
    success: true,
    message: 'Note rejected',
    note,
  });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalNotes = await Note.countDocuments();
  const approvedNotes = await Note.countDocuments({ status: 'approved' });
  const pendingNotes = await Note.countDocuments({ status: 'pending' });
  const rejectedNotes = await Note.countDocuments({ status: 'rejected' });

  const totalDownloads = await Note.aggregate([
    {
      $group: {
        _id: null,
        totalDownloads: { $sum: '$downloadCount' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalNotes,
      approvedNotes,
      pendingNotes,
      rejectedNotes,
      totalDownloads: totalDownloads[0]?.totalDownloads || 0,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password -googleId')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    users,
    total,
    pages: Math.ceil(total / limit),
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted',
  });
});
