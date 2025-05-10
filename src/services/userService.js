// src/services/userService.js
import api from './api';

const userService = {
  // Get user profile details
  getUserProfile: async () => {
    try {
      console.log('Fetching user profile...');
      const headers = userService._getAuthHeader();
      console.log('Using auth headers:', headers);
      
      // Fix the URL by removing the leading slash
      const response = await api.get('auth/user/profile', { 
        headers,
        withCredentials: true 
      });
      
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile details
  updateUserProfile: async (userData) => {
    try {
      console.log('Updating user profile with data:', userData);
      const headers = userService._getAuthHeader();
      
      const response = await api.put('auth/user/update', userData, { 
        headers,
        withCredentials: true 
      });
      
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      console.log('Changing password...');
      const headers = userService._getAuthHeader();
      
      const response = await api.post('auth/user/change-password', passwordData, { 
        headers,
        withCredentials: true 
      });
      
      console.log('Password change response:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      console.log('Fetching user orders...');
      const headers = userService._getAuthHeader();
      console.log('Using auth headers:', headers);
      
      const response = await api.get('order/users/all', { 
        headers,
        withCredentials: true // Include cookies for session-based auth
      });
      
      console.log('Orders response:', response.data);
      return response.data || [];
    } catch (error) {
      // Handle common errors
      if (error.response) {
        if (error.response.status === 404) {
          console.log('No orders found (404)');
          return []; // Return empty array if no orders found
        } else if (error.response.status === 401 || error.response.status === 403) {
          console.error('Authentication error:', error.response.status);
          // Maybe redirect to login or refresh token
        }
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', error.message);
      }
      
      // For any error, return empty array instead of throwing
      // This prevents the component from crashing
      console.error('Error fetching user orders:', error);
      return [];
    }
  },
  
  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      console.log(`Fetching order details for ID: ${orderId}`);
      const headers = userService._getAuthHeader();
      console.log('Using auth headers:', headers);
      
      const response = await api.get(`order/users/${orderId}`, { 
        headers,
        withCredentials: true // Include cookies for session-based auth
      });
      
      console.log('Order details response:', response.data);
      return response.data;
    } catch (error) {
      // Handle common errors
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        if (error.response.status === 404) {
          return null; // Return null if order not found
        } else if (error.response.status === 401 || error.response.status === 403) {
          console.error('Authentication error:', error.response.status);
          // Maybe redirect to login or refresh token
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      console.error('Error fetching order details:', error);
      return null;
    }
  },
  _getAuthHeader: () => {
    try {
      // Try to get user from localStorage
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.warn('No user data found in localStorage');
        return {};
      }
      
      const user = JSON.parse(userString);
      
      // Look for token in different possible places
      const token = user.jwtToken || user.token || user.accessToken;
      
      if (!token) {
        console.warn('No JWT token found in user data:', user);
        return {};
      }
      
      console.log('Found JWT token:', token.substring(0, 15) + '...');
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return {};
    }
  }
};

export default userService;