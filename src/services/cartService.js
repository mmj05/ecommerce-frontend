import api from './api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get('/carts/users/cart');
    return response.data;
  },

  // Add product to cart
  addToCart: async (productId, quantity) => {
    const response = await api.post(`/carts/products/${productId}/quantity/${quantity}`);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (productId, operation) => {
    const response = await api.put(`/cart/products/${productId}/quantity/${operation}`);
    return response.data;
  },

  // Remove product from cart
  removeFromCart: async (cartId, productId) => {
    const response = await api.delete(`/carts/${cartId}/product/${productId}`);
    return response.data;
  }
};

export default cartService;