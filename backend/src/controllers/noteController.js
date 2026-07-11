import { asyncHandler } from '../middleware/errorHandler.js';
import Note from '../models/Note.js';
import Category from '../models/Category.js';
import Download from '../models/Download.js';
import Bookmark from '../models/Bookmark.js';
import Rating from '../models/Rating.js';
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary, getFileExtension } from '../utils/fileUpload.js';
import { searchNotes, getPersonalizedRecommendations, getNotesForAdmin, approveNote, rejectNote, getUserNotes } from '../services/noteService.js';
import { sendNoteApprovedEmail, sendNoteRejectedEmail, sendRatingNotificationEmail } from '../services/emailService.js';
import { createNotification } from '../services/notificationService.js';

export const uploadNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { title, description, subject, module, category, university, branch, semester, tags } = req.body;

  // Upload to Cloudinary
  const cloudinaryResult = await uploadToCloudinary(req.file, 'rostar-notes');

  const fileExtension = getFileExtension(req.file.originalname);

  const note = new Note({
    title,
    description,
    subject,
    module,
    category,
    university,
    branch,
    semester: parseInt(semester),
    uploadedBy: req.user.userId,
    fileUrl: cloudinaryResult.secure_url,
    fileType: fileExtension,
    fileSize: req.file.size,
    thumbnail: cloudinaryResult.secure_url,
    tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
  });

  await note.save();

  // Add to user's uploadedNotes
  await User.findByIdAndUpdate(req.user.userId, {
    $push: { uploadedNotes: note._id },
  });

  res.status(201).json({
    success: true,
    message: 'Note uploaded successfully. Awaiting admin approval.',
    note,
  });
});

export const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate('uploadedBy', 'firstName lastName profileImage')
    .populate('category', 'name')
    .populate({
      path: 'ratings',
      populate: {
        path: 'userId',
        select: 'firstName lastName profileImage',
      },
    });

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Check if note is private and if user has access
  if (note.isPrivate && note.uploadedBy._id.toString() !== req.user?.userId && req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json({
    success: true,
    note,
  });
});

export const searchNotesEndpoint = asyncHandler(async (req, res) => {
  const { q, category, university, branch, semester, sortBy, page = 1, limit = 10 } = req.query;

  const filters = {
    category,
    university,
    branch,
    semester,
    sortBy,
  };

  const result = await searchNotes(q, filters, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getRecommendationsEndpoint = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  const user = await User.findById(req.user.userId).select('university branch semester firstName lastName');

  const result = await getPersonalizedRecommendations(
    {
      university: user?.university,
      branch: user?.branch,
      semester: user?.semester,
    },
    q,
    parseInt(page),
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const downloadNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Check if download already exists
  const existingDownload = await Download.findOne({
    noteId: id,
    userId: req.user.userId,
  });

  if (!existingDownload) {
    const download = new Download({
      noteId: id,
      userId: req.user.userId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await download.save();

    // Increment download count
    await Note.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

    // Add to user's downloads
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { downloads: download._id },
    });
  }

  res.status(200).json({
    success: true,
    downloadUrl: note.fileUrl,
    fileName: note.title,
  });
});

export const bookmarkNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if already bookmarked
  const existingBookmark = await Bookmark.findOne({
    noteId: id,
    userId: req.user.userId,
  });

  if (existingBookmark) {
    // Remove bookmark
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    await Note.findByIdAndUpdate(id, { $inc: { bookmarkCount: -1 } });
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { bookmarks: id },
    });

    return res.status(200).json({
      success: true,
      message: 'Bookmark removed',
      isBookmarked: false,
    });
  }

  // Add bookmark
  const bookmark = new Bookmark({
    noteId: id,
    userId: req.user.userId,
  });

  await bookmark.save();
  await Note.findByIdAndUpdate(id, { $inc: { bookmarkCount: 1 } });
  await User.findByIdAndUpdate(req.user.userId, {
    $push: { bookmarks: id },
  });

  res.status(201).json({
    success: true,
    message: 'Note bookmarked',
    isBookmarked: true,
  });
});

export const rateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Check if user already rated
  const existingRating = await Rating.findOne({
    noteId: id,
    userId: req.user.userId,
  });

  let ratingDoc;

  if (existingRating) {
    // Update existing rating
    ratingDoc = await Rating.findByIdAndUpdate(
      existingRating._id,
      { rating, comment },
      { new: true }
    );
  } else {
    // Create new rating
    ratingDoc = new Rating({
      noteId: id,
      userId: req.user.userId,
      rating,
      comment,
    });

    await ratingDoc.save();

    // Add to note's ratings
    await Note.findByIdAndUpdate(id, {
      $push: { ratings: ratingDoc._id },
    });

    // Add to user's ratings
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { ratings: ratingDoc._id },
    });

    // Send notification to uploader
    const uploader = await User.findById(note.uploadedBy);
    try {
      await sendRatingNotificationEmail(uploader.email, req.user.userId, note.title, rating);
    } catch (error) {
      console.error('Email send error:', error);
    }

    await createNotification(
      note.uploadedBy,
      'new_rating',
      'New Rating',
      `Your note "${note.title}" received a ${rating} star rating`,
      id,
      req.user.userId
    );
  }

  // Calculate average rating
  const ratings = await Rating.find({ noteId: id });
  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  await Note.findByIdAndUpdate(id, { averageRating });

  res.status(201).json({
    success: true,
    message: 'Rating submitted',
    rating: ratingDoc,
  });
});

export const getApprovedNotes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await getUserNotes(req.user.userId, parseInt(page), parseInt(limit));

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Check authorization
  if (note.uploadedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this note' });
  }

  // Delete from Cloudinary
  try {
    const publicId = note.fileUrl.split('/').slice(-1)[0].split('.')[0];
    await deleteFromCloudinary(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }

  await Note.findByIdAndDelete(req.params.id);

  // Remove from user's uploadedNotes
  await User.findByIdAndUpdate(note.uploadedBy, {
    $pull: { uploadedNotes: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
  });
});
