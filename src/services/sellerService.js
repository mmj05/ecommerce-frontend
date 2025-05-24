// src/services/sellerService.js
import api from './api';

const sellerService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/seller/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get seller orders with pagination
  getSellerOrders: async (pageNumber = 0, pageSize = 10, sortBy = 'orderDate', sortOrder = 'DESC') => {
    try {
      const response = await api.get('/seller/orders', {
        params: { pageNumber, pageSize, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      throw error;
    }
  },

  // Get specific order details
  getSellerOrderById: async (orderId) => {
    try {
      const response = await api.get(`/seller/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Update order status (seller can only mark as shipped)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/seller/orders/${orderId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  },

  // Get seller products with pagination (already exists in productService)
  getSellerProducts: async (pageNumber = 0, pageSize = 10, sortBy = 'productId', sortOrder = 'desc') => {
    try {
      const response = await api.get('/seller/products', {
        params: { pageNumber, pageSize, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching seller products:', error);
      
      // Fallback to using admin endpoint with filtering if seller endpoint doesn't exist
      if (error.response && error.response.status === 404) {
        // This would need backend implementation to filter by seller
        return api.get('/admin/products', {
          params: { pageNumber, pageSize, sortBy, sortOrder }
        }).then(res => res.data);
      }
      
      throw error;
    }
  }
};

export default sellerService;