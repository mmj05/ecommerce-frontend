// src/services/orderService.js
import api from './api';

const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      // Extract payment method from the orderData
      const { paymentMethod } = orderData;
      
      // Make sure payment method is at least 4 characters as required by backend
      let validPaymentMethod = paymentMethod;
      if (!validPaymentMethod || validPaymentMethod.length < 4) {
        if (validPaymentMethod === 'cod') {
          validPaymentMethod = 'cash';
        } else if (validPaymentMethod === 'cc') {
          validPaymentMethod = 'card';
        } else {
          // Default fallback
          validPaymentMethod = validPaymentMethod + '_pay';
        }
      }
      
      // Get auth token from localStorage if available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.jwtToken;
      
      // Set headers with authentication token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if token exists
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        withCredentials: true // Include cookies for session authentication
      };
      
      console.log('Creating order with payment method:', validPaymentMethod);
      console.log('Order data:', {...orderData, paymentMethod: validPaymentMethod});
      
      // Make the API call with explicit auth headers and corrected payment method
      const response = await api.post(
        `/order/users/payments/${validPaymentMethod}`, 
        {...orderData, paymentMethod: validPaymentMethod}, 
        config
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Response:', error.response?.data);
      
      // Provide better error information
      if (error.response && error.response.status === 401) {
        throw new Error('Authentication failed. Please log in again to place your order.');
      } else if (error.response && error.response.data) {
        // Extract specific error message if available
        const errorMsg = error.response.data.message || 'Failed to create order';
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  },

  // Get all orders for the current user
  getUserOrders: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.jwtToken;
      
      const config = {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        withCredentials: true
      };
      
      const response = await api.get('/orders/users/all', config);
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get specific order by ID
  getOrderById: async (orderId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user.jwtToken;
      
      const config = {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        withCredentials: true
      };
      
      const response = await api.get(`/orders/users/${orderId}`, config);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }
};

export default orderService;