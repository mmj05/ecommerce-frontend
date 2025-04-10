import api from './api';

const addressService = {
  // Get all user addresses
  getUserAddresses: async () => {
    try {
      const response = await api.get('/users/addresses');
      return response.data;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }
  },

  // Add a new address
  addAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  // Update an existing address
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error(`Error updating address ${addressId}:`, error);
      throw error;
    }
  },

  // Delete an address
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting address ${addressId}:`, error);
      throw error;
    }
  }
};

export default addressService;