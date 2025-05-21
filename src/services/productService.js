// src/services/productService.js - Enhanced for seller/admin features
import api from './api';

const productService = {
  // Get all products with pagination
  getAllProducts: async (pageNumber = 0, pageSize = 10, sortBy = 'productId', sortOrder = 'asc') => {
    const response = await api.get('/public/products', {
      params: { pageNumber, pageSize, sortBy, sortOrder }
    });
    return response.data;
  },

  // Get product details by ID
  getProductDetails: async (productId) => {
    const response = await api.get(`/public/products/${productId}`);
    return response.data;
  },

  // Get products by category with pagination
  getProductsByCategory: async (categoryId, pageNumber = 0, pageSize = 10, sortBy = 'productId', sortOrder = 'asc') => {
    const response = await api.get(`/public/categories/${categoryId}/products`, {
      params: { pageNumber, pageSize, sortBy, sortOrder }
    });
    return response.data;
  },

  // Search products by keyword
  searchProducts: async (keyWord, pageNumber = 0, pageSize = 10, sortBy = 'productId', sortOrder = 'asc') => {
    const response = await api.get(`/public/products/keyword/${keyWord}`, {
      params: { pageNumber, pageSize, sortBy, sortOrder }
    });
    return response.data;
  },

  // Create a new product - Seller/Admin only
  createProduct: async (productData) => {
    try {
      // Extract category ID from the product data
      const { categoryId, ...productInfo } = productData;
      
      // Create product in the specific category
      const response = await api.post(`/admin/categories/${categoryId}/products`, productInfo);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product - Seller/Admin only
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/admin/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw error;
    }
  },

  // Delete product - Seller/Admin only
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw error;
    }
  },

  // Upload product image - Seller/Admin only
  uploadProductImage: async (productId, imageFile) => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.put(`/admin/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Bulk upload product images - Seller/Admin only
  uploadProductImages: async (productId, imageFiles) => {
    try {
      // Create form data with multiple images
      const formData = new FormData();
      
      // Append each image to form data
      imageFiles.forEach((file, index) => {
        formData.append('images', file);
      });
      
      const response = await api.post(`/admin/products/${productId}/images/bulk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading images for product ${productId}:`, error);
      throw error;
    }
  },

  // Get seller's products - Seller only
  getSellerProducts: async (pageNumber = 0, pageSize = 10, sortBy = 'productId', sortOrder = 'desc') => {
    try {
      const response = await api.get('/seller/products', {
        params: { pageNumber, pageSize, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw error;
    }
  }
};

export default productService;