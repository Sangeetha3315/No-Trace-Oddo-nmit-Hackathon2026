import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signUp: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  verifyEmail: async (email) => {
    const response = await api.post(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    return response.data;
  }
};
