import api from './api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/carts/users/cart');
      return response.data;
    } catch (error) {
      // Handle 404 (cart not found) or other common errors
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        console.log('No cart found in backend, returning empty cart');
        // Return an empty cart rather than throwing an error
        return {
          products: [],
          totalPrice: 0
        };
      }
      throw error; // Re-throw other errors
    }
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
  // Update the deleteEmptyCart method in cartService.js

  // Delete empty cart
  deleteEmptyCart: async () => {
    try {
      // Add a timeout to prevent rapid successive calls
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await api.delete('/carts/empty');
      return response.data;
    } catch (error) {
      // Special handling for common errors
      if (error.response && error.response.status === 404) {
        // Cart not found is not really an error for our purpose
        console.log('No cart found to delete, this is expected');
        return { message: 'No cart to delete' };
      }
      
      // For real errors, log and throw
      console.error('Error deleting empty cart:', error);
      throw error;
    }
  }
};

export default cartService;