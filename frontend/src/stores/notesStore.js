import { create } from 'zustand';
import { notesAPI } from '../services/api';

export const useNotesStore = create((set) => ({
  notes: [],
  userNotes: [],
  currentNote: null,
  loading: false,
  searchLoading: false,
  total: 0,
  pages: 0,
  currentPage: 1,

  searchNotes: async (query, filters = {}, page = 1) => {
    set({ searchLoading: true });
    try {
      const response = await notesAPI.searchNotes({
        q: query,
        ...filters,
        page,
        limit: 10,
      });
      set({
        notes: response.data.notes,
        total: response.data.total,
        pages: response.data.pages,
        currentPage: page,
        searchLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ searchLoading: false });
      throw error;
    }
  },

  uploadNote: async (formData) => {
    set({ loading: true });
    try {
      const response = await notesAPI.uploadNote(formData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getNoteById: async (id) => {
    set({ loading: true });
    try {
      const response = await notesAPI.getNoteById(id);
      set({ currentNote: response.data.note, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  getUserNotes: async (page = 1) => {
    set({ loading: true });
    try {
      const response = await notesAPI.getUserNotes({ page, limit: 10 });
      set({
        userNotes: response.data.notes,
        total: response.data.total,
        pages: response.data.pages,
        currentPage: page,
        loading: false,
      });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  downloadNote: async (id) => {
    try {
      const response = await notesAPI.downloadNote(id);
      window.open(response.data.downloadUrl, '_blank');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bookmarkNote: async (id) => {
    try {
      const response = await notesAPI.bookmarkNote(id);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  rateNote: async (id, rating, comment) => {
    try {
      const response = await notesAPI.rateNote(id, { rating, comment });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await notesAPI.deleteNote(id);
      set((state) => ({
        userNotes: state.userNotes.filter((note) => note._id !== id),
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  clearCurrentNote: () => set({ currentNote: null }),
}));
