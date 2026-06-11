import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://student-notes-sharing-lexup41tq-ashwinitgadad15s-projects.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
  getUser: (id) => api.get(`/auth/user/${id}`),
};

// Notes endpoints
export const notesAPI = {
  uploadNote: (formData) => api.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  searchNotes: (params) => api.get('/notes/search', { params }),
  getNoteById: (id) => api.get(`/notes/${id}`),
  downloadNote: (id) => api.get(`/notes/${id}/download`),
  bookmarkNote: (id) => api.post(`/notes/${id}/bookmark`),
  rateNote: (id, data) => api.post(`/notes/${id}/rate`, data),
  getUserNotes: (params) => api.get('/notes/user/notes/approved', { params }),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getPendingNotes: (params) => api.get('/admin/notes/pending', { params }),
  approveNote: (id) => api.post(`/admin/notes/${id}/approve`),
  rejectNote: (id, data) => api.post(`/admin/notes/${id}/reject`, data),
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
