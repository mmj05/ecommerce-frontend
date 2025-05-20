import api from './api';

const categoryService = {
  // Get all categories with pagination
  getAllCategories: async (pageNumber = 0, pageSize = 10, sortBy = 'categoryId', sortOrder = 'asc') => {
    try {
      const response = await api.get('/public/categories', {
        params: { pageNumber, pageSize, sortBy, sortOrder }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a new category - Admin only
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/public/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update an existing category - Admin only
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${categoryId}:`, error);
      throw error;
    }
  },

  // Delete a category - Admin only
  deleteCategory: async (categoryId) => {
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${categoryId}:`, error);
      throw error;
    }
  }
};

export default categoryService;