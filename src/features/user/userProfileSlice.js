// src/features/user/userProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

const initialState = {
  profile: null,
  orders: [],
  currentOrder: null,
  isLoading: false,
  updateSuccess: false,
  error: null
};

// Get user profile
export const getUserProfile = createAsyncThunk(
  'userProfile/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUserProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'userProfile/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      return await userService.updateUserProfile(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'userProfile/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      return await userService.changePassword(passwordData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
  'userProfile/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('getUserOrders thunk called');
      const result = await userService.getUserOrders();
      console.log('getUserOrders thunk result:', result);
      return result;
    } catch (error) {
      console.error('getUserOrders thunk error:', error);
      // Return empty array instead of rejecting
      // This prevents the reducer from setting error state
      return [];
    }
  }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
  'userProfile/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log(`getOrderById thunk called for ID: ${orderId}`);
      const result = await userService.getOrderById(orderId);
      console.log(`getOrderById thunk result for ID ${orderId}:`, result);
      return result || null; // Return null if result is undefined/falsy
    } catch (error) {
      console.error(`getOrderById thunk error for ID ${orderId}:`, error);
      // Still reject so the component can handle the error
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearUpdateStatus: (state) => {
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.updateSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      
      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        console.log('getUserOrders reducer updated state:', state.orders);
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orders = []; // Ensure orders is always an array
        console.error('getUserOrders reducer rejected with error:', action.payload);
      })
      
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfileError, clearUpdateStatus } = userProfileSlice.actions;
export default userProfileSlice.reducer;