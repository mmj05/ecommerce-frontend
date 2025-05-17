// src/services/orderService.js - Fixed for cookie-based auth
import api from './api';

const orderService = {
  // Create a new order
  createOrder: async (orderData, paymentMethod) => {
    try {
      // Ensure payment method is at least 4 characters as required by backend
      let finalPaymentMethod = paymentMethod || orderData.paymentMethod || 'cash';
      if (finalPaymentMethod.length < 4) {
        // Ensure it's 4+ characters
        finalPaymentMethod = finalPaymentMethod === 'cod' ? 'cash' : finalPaymentMethod + '_pay';
      }
      
      console.log('Creating order with payment method:', finalPaymentMethod);
      console.log('Order data:', orderData);
      
      // Check if user is logged in (based on localStorage flag)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.isLoggedIn) {
        throw new Error('Authentication failed. Please log in again to place your order.');
      }
      
      // The cookie will be sent automatically thanks to withCredentials: true
      const response = await api.post(`/order/users/payments/${finalPaymentMethod}`, orderData);
      
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Provide helpful error messages
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Authentication failed. Please log in again to place your order.');
        } else if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw error;
    }
  },

  // Get all orders for the current user
  getUserOrders: async () => {
    try {
      // The cookie will be sent automatically
      const response = await api.get('/orders/users/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get specific order by ID
  getOrderById: async (orderId) => {
    try {
      // The cookie will be sent automatically
      const response = await api.get(`/orders/users/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }
};

export default orderService;