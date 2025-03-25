import api from './api';

const authService = {
  // Login user
  login: async (userData) => {
    const response = await api.post('/auth/signin', userData);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Get current user details
  getCurrentUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/signout');
    return response.data;
  }
};

export default authService;