import api from './api';

const productService = {
  // Get all products with pagination
  getAllProducts: async (pageNumber = 0, pageSize = 10, sortBy = 'productId', sortOrder = 'asc') => {
    const response = await api.get('/public/products', {
      params: { pageNumber, pageSize, sortBy, sortOrder }
    });
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

  // Get all categories
  getAllCategories: async (pageNumber = 0, pageSize = 10, sortBy = 'categoryId', sortOrder = 'asc') => {
    const response = await api.get('/public/categories', {
      params: { pageNumber, pageSize, sortBy, sortOrder }
    });
    return response.data;
  },
};

export default productService;