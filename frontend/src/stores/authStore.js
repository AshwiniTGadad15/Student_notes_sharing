import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  register: async (data) => {
    set({ loading: true });
    try {
      const response = await authAPI.register(data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore logout errors and clear local state anyway.
    }
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  getProfile: async () => {
    try {
      const response = await authAPI.getProfile();
      set({ user: response.data.user });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      set({ user: response.data.user });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: !!token });
  },
}));
