import axios from 'axios';
import Note from '../models/Note.js';
import Category from '../models/Category.js';

export const buildRecommendationQuery = (profile = {}, query = '') => {
  const terms = [];

  if (profile?.university) {
    terms.push(profile.university);
  }
  if (profile?.branch) {
    terms.push(profile.branch);
  }
  if (profile?.semester) {
    terms.push(`semester ${profile.semester}`);
  }
  if (query) {
    terms.push(query);
  }

  return {
    query: terms.filter(Boolean).join(' '),
    filters: {
      university: profile?.university || undefined,
      branch: profile?.branch || undefined,
      semester: profile?.semester || undefined,
    },
  };
};

export const searchNotes = async (query, filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const searchQuery = {
    status: 'approved',
    isPrivate: false,
  };

  // Full text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Apply filters
  if (filters.category) {
    searchQuery.category = filters.category;
  }
  if (filters.university) {
    searchQuery.university = filters.university;
  }
  if (filters.branch) {
    searchQuery.branch = filters.branch;
  }
  if (filters.semester) {
    searchQuery.semester = parseInt(filters.semester);
  }
  if (filters.subject) {
    searchQuery.subject = { $regex: filters.subject, $options: 'i' };
  }

  // Sort options
  let sortQuery = {};
  if (filters.sortBy === 'downloads') {
    sortQuery = { downloadCount: -1 };
  } else if (filters.sortBy === 'rating') {
    sortQuery = { averageRating: -1 };
  } else if (filters.sortBy === 'recent') {
    sortQuery = { createdAt: -1 };
  } else if (filters.sortBy === 'views') {
    sortQuery = { viewCount: -1 };
  } else {
    sortQuery = { createdAt: -1 };
  }

  const notes = await Note.find(searchQuery)
    .sort(sortQuery)
    .skip(skip)
    .limit(limit)
    .populate('uploadedBy', 'firstName lastName profileImage')
    .populate('category', 'name color');

  const total = await Note.countDocuments(searchQuery);

  return {
    notes,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const getPersonalizedRecommendations = async (userProfile = {}, query = '', page = 1, limit = 10) => {
  const { query: recommendationQuery, filters } = buildRecommendationQuery(userProfile, query);
  const localResult = await searchNotes(recommendationQuery, { ...filters, sortBy: 'recent' }, page, limit);

  let externalResults = [];
  const hasWebSearchConfig = Boolean(process.env.SEARCH_API_KEY && process.env.SEARCH_ENGINE_ID);

  if (hasWebSearchConfig) {
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: process.env.SEARCH_API_KEY,
          cx: process.env.SEARCH_ENGINE_ID,
          q: recommendationQuery,
          num: 5,
        },
        timeout: 10000,
      });

      externalResults = (response.data.items || []).map((item) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        source: 'web',
      }));
    } catch (error) {
      console.error('External note search failed:', error.message);
    }
  }

  return {
    ...localResult,
    notes: localResult.notes,
    externalResults,
    usedExternalSearch: hasWebSearchConfig,
    searchQuery: recommendationQuery,
  };
};

export const getNotesForAdmin = async (page = 1, limit = 10, status = 'pending') => {
  const skip = (page - 1) * limit;

  const query = status ? { status } : {};

  const notes = await Note.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('uploadedBy', 'firstName lastName email')
    .populate('category', 'name');

  const total = await Note.countDocuments(query);

  return {
    notes,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const approveNote = async (noteId, approvedBy) => {
  const note = await Note.findByIdAndUpdate(
    noteId,
    { status: 'approved', approvedBy },
    { new: true }
  );

  // Update category notes count
  await Category.findByIdAndUpdate(note.category, { $inc: { notesCount: 1 } });

  return note;
};

export const rejectNote = async (noteId, rejectionReason) => {
  const note = await Note.findByIdAndUpdate(
    noteId,
    { status: 'rejected', rejectionReason },
    { new: true }
  );

  return note;
};

export const getUserNotes = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const notes = await Note.find({ uploadedBy: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('category', 'name');

  const total = await Note.countDocuments({ uploadedBy: userId });

  return {
    notes,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
};
