// src/features/orders/orderSlice.js - Updated for order history
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  orders: [],
  order: null,
  orderItems: [],
  isLoading: false,
  success: false,
  error: null,
};

// Create a new order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      // Check if user is authenticated using the auth state
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to place an order.');
      }
      
      // Prepare payment method - ensure it's at least 4 characters
      let paymentMethod = orderData.paymentMethod || 'cash';
      
      // Call the service (which will use cookies for auth)
      return await orderService.createOrder(orderData, paymentMethod);
    } catch (error) {
      console.error('Error in createOrder thunk:', error);
      return rejectWithValue(error.message || 'Failed to create order. Please try again.');
    }
  }
);

// Get all orders for the current user
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check auth state
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to view orders.');
      }
      
      return await orderService.getUserOrders();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

// Get order details by ID
export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { rejectWithValue, getState }) => {
    try {
      // Check auth state
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to view order details.');
      }
      
      return await orderService.getOrderById(orderId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order details');
    }
  }
);

// Get order items
export const getOrderItems = createAsyncThunk(
  'orders/getOrderItems',
  async (orderId, { rejectWithValue, getState }) => {
    try {
      // Check auth state
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to view order items.');
      }
      
      return await orderService.getOrderItems(orderId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order items');
    }
  }
);

// Cancel an order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue, getState, dispatch }) => {
    try {
      // Check auth state
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return rejectWithValue('You must be logged in to cancel an order.');
      }
      
      const result = await orderService.cancelOrder(orderId);
      
      // Refresh orders list after cancellation
      dispatch(getUserOrders());
      
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel order');
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
        // console.log('Order created successfully:', action.payload);
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
        state.orders = action.payload || [];
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Ensure orders is an array even when there's an error
        state.orders = [];
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
      })
      
      // Get order items
      .addCase(getOrderItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderItems = action.payload;
      })
      .addCase(getOrderItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Ensure orderItems is an array even when there's an error
        state.orderItems = [];
      })
      
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.isLoading = false;
        // The actual orders update will happen when getUserOrders is dispatched
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;