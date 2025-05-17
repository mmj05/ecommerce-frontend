// src/services/authService.js - Fixed for cookie-based auth
import api from './api';

const authService = {
  // Login user - Correctly handles cookie-based auth
  login: async (userData) => {
    try {
      // The backend sets JWT as HTTP-only cookie
      const response = await api.post('/auth/signin', userData);
      
      // Store user info from response (no need to extract token)
      const userInfo = {
        ...response.data,
        isLoggedIn: true  // Add flag to indicate logged-in state
      };
      
      // Store user info (but not JWT - it's in the HTTP-only cookie)
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return userInfo;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user - Unchanged
  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user details
  getCurrentUser: async () => {
    try {
      // The cookie is sent automatically with withCredentials: true
      const response = await api.get('/auth/user');
      
      if (response.data) {
        // Update user info in localStorage
        const userInfo = {
          ...response.data,
          isLoggedIn: true
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        return userInfo;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      
      // Clear user data on authentication error
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('user');
      }
      
      return null;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Backend will clear the JWT cookie
      const response = await api.post('/auth/signout');
      
      // Clear user data from localStorage
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error) {
      // Still clear localStorage on error
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Password reset functions (unchanged)
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;