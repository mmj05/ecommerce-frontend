import api from './api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/carts/users/cart');
    return response.data;
  },

  // Add product to cart
  addToCart: async (productId, quantity) => {
    try {
      const response = await api.post(`/carts/products/${productId}/quantity/${quantity}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, operation) => {
    try {
      const response = await api.put(`/cart/products/${productId}/quantity/${operation}`);
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove product from cart
  removeFromCart: async (cartId, productId) => {
    try {
      const response = await api.delete(`/carts/${cartId}/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Delete empty cart
  deleteEmptyCart: async () => {
    try {
      const response = await api.delete('/carts/empty');
      return response.data;
    } catch (error) {
      console.error('Error deleting empty cart:', error);
      throw error;
    }
  }
};

export default cartService;