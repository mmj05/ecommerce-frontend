// Updated authService.js for header-based authentication
import api from './api';

const authService = {
  // Login user - Now handles JWT token from response body
  login: async (userData) => {
    try {
      // The backend returns JWT in response body
      const response = await api.post('/auth/signin', userData);
      
      // Store user info with JWT token
      const userInfo = {
        ...response.data,
        isLoggedIn: true  // Add flag to indicate logged-in state
      };
      
      // Store user info including JWT token
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return userInfo;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Get current user details
  getCurrentUser: async () => {
    try {
      // Check if we have a valid token first
      const user = localStorage.getItem('user');
      if (!user) {
        return null;
      }
      
      let userData;
      try {
        userData = JSON.parse(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        return null;
      }
      
      if (!userData.jwtToken) {
        localStorage.removeItem('user');
        return null;
      }
      
      // The Authorization header is added automatically by the request interceptor
      const response = await api.get('/auth/user');
      
      if (response.data) {
        // Update user info in localStorage (keep the existing JWT token)
        const updatedUserInfo = {
          ...response.data,
          jwtToken: userData.jwtToken, // Keep the existing token
          isLoggedIn: true
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUserInfo));
        return updatedUserInfo;
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
      // Backend no longer needs to clear cookies
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

  // Update user email - UPDATED endpoint
  updateUserEmail: async (email) => {
    const response = await api.put('/profile/email', { email });
    
    // Update user info in localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    userData.email = email;
    localStorage.setItem('user', JSON.stringify(userData));
    
    return response.data;
  },

  // Change password - UPDATED endpoint
  changePassword: async (passwordData) => {
    const response = await api.put('/profile/password', passwordData);
    return response.data;
  },

  // Password reset functions
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
  }
};

export default authService;