// src/features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  success: false,
  error: null,
};

// Create a new order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      // Get auth state to check authentication
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to place an order.');
      }
      
      // Ensure the data format matches what the backend expects
      // Create the proper order request object
      const orderRequest = {
        addressId: orderData.addressId,
        // The rest are for payment information
        pgName: orderData.pgName || 'NA',
        pgPaymentId: orderData.pgPaymentId || 'NA', 
        pgStatus: orderData.pgStatus || 'pending',
        pgResponseMessage: orderData.pgResponseMessage || 'Order placed'
      };
      
      console.log('Creating order with request:', orderRequest);
      
      // Pass paymentMethod separately as it's used in the URL path
      const paymentMethod = orderData.paymentMethod || 'cod';
      
      return await orderService.createOrder(orderRequest, paymentMethod);
    } catch (error) {
      console.error('Error in createOrder thunk:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create order. Please try again.');
    }
  }
);

// Get all orders for the current user
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Get auth state to check authentication
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to view orders.');
      }
      
      return await orderService.getUserOrders();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch orders');
    }
  }
);

// Get order details by ID
export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { rejectWithValue, getState }) => {
    try {
      // Get auth state to check authentication
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to view order details.');
      }
      
      return await orderService.getOrderById(orderId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch order details');
    }
  }
);

// Orders slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.isLoading = false;
      state.success = false;
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.order = action.payload;
        console.log('Order created successfully:', action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
        console.error('Order creation rejected:', action.payload);
      })
      
      // Get user orders
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;