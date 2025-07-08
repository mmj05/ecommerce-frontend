import api from './api';

const cartService = {
  // Get user's cart with proper error handling and throttling
  getCart: async () => {
    try {
      // Use timestamp to prevent duplicate calls in quick succession
      const now = Date.now();
      const lastFetchTime = parseInt(localStorage.getItem('lastCartFetchTime') || '0');
      
      // If last fetch was less than 300ms ago, use cached data instead
      if (now - lastFetchTime < 300) {
        // console.log('Using cached cart data');
        const cachedCart = localStorage.getItem('cachedCartData');
        if (cachedCart) {
          return JSON.parse(cachedCart);
        }
      }
      
      // Update last fetch time
      localStorage.setItem('lastCartFetchTime', now.toString());
      
      const response = await api.get('/carts/users/cart');
      // console.log('Cart data from server:', response.data);
      
      // Cache the successful response
      localStorage.setItem('cachedCartData', JSON.stringify(response.data));
      
      return response.data;
    } catch (error) {
      // Handle 404 (cart not found) or other common errors
      if (error.response && (error.response.status === 404 || error.response.status === 400)) {
        // console.log('No cart found in backend, returning empty cart');
        // Return an empty cart rather than throwing an error
        const emptyCart = {
          products: [],
          totalPrice: 0
        };
        
        // Cache the empty cart
        localStorage.setItem('cachedCartData', JSON.stringify(emptyCart));
        
        return emptyCart;
      }
      throw error; // Re-throw other errors
    }
  },

  // Add product to cart
  addToCart: async (productId, quantity) => {
    try {
      // console.log(`Adding product ID ${productId} with quantity ${quantity} to cart via API`);
      
      const response = await api.post(`/carts/products/${productId}/quantity/${quantity}`);
      // console.log('Response from adding to cart:', response.data);
      
      // Update cache with the new cart data
      localStorage.setItem('cachedCartData', JSON.stringify(response.data));
      localStorage.setItem('lastCartFetchTime', Date.now().toString());
      
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (productId, operation) => {
    try {
      const response = await api.put(`/carts/products/${productId}/quantity/${operation}`);
      
      // Update cache with the new cart data
      localStorage.setItem('cachedCartData', JSON.stringify(response.data));
      localStorage.setItem('lastCartFetchTime', Date.now().toString());
      
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
      
      // Invalidate cache when removing items
      localStorage.removeItem('cachedCartData');
      
      return response.data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Delete empty cart
  deleteEmptyCart: async () => {
    try {
      // Add a timeout to prevent rapid successive calls
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await api.delete('/carts/empty');
      
      // Invalidate cache when cart is deleted
      localStorage.removeItem('cachedCartData');
      
      return response.data;
    } catch (error) {
      // Special handling for common errors
      if (error.response && error.response.status === 404) {
        // Cart not found is not really an error for our purpose
        // console.log('No cart found to delete, this is expected');
        
        // Ensure cache is cleared
        localStorage.removeItem('cachedCartData');
        
        return { message: 'No cart to delete' };
      }
      
      // For real errors, log and throw
      console.error('Error deleting empty cart:', error);
      throw error;
    }
  }
};

export default cartService;