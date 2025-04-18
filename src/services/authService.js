// src/services/authService.js - Enhanced version

import api from './api';

const authService = {
  // Login user
  login: async (userData) => {
    try {
      console.log('Login attempt with:', userData.username);
      const response = await api.post('/auth/signin', userData);
      
      // Log the entire response for debugging
      console.log('Login API response:', response);
      
      // Extract JWT token from response or headers
      let jwtToken = null;
      
      // Check response data for token
      if (response.data && (response.data.jwtToken || response.data.token || response.data.accessToken)) {
        jwtToken = response.data.jwtToken || response.data.token || response.data.accessToken;
      }
      
      // Check headers for Authorization token
      if (!jwtToken && response.headers && response.headers.authorization) {
        jwtToken = response.headers.authorization.replace('Bearer ', '');
      }
      
      // Add token to the response data
      const enhancedResponse = {
        ...response.data,
        jwtToken
      };
      
      console.log('Enhanced login response:', enhancedResponse);
      return enhancedResponse;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Response:', error.response);
      throw error;
    }
  },

  // Register user
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
      const response = await api.get('/auth/user');
      
      // Save the user data with any token information
      const userData = response.data;
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Preserve the token if it exists
      if (currentUser.jwtToken) {
        userData.jwtToken = currentUser.jwtToken;
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/signout');
      // Clear user from localStorage regardless of response
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      // Still clear localStorage on error
      localStorage.removeItem('user');
      throw error;
    }
  },

  // The rest of the methods remain the same
  requestPasswordReset: async (email) => {
    // Implementation
  },

  resetPassword: async (token, newPassword) => {
    // Implementation
  }
};

export default authService;