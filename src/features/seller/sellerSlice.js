// src/features/seller/sellerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sellerService from '../../services/sellerService';

const initialState = {
  dashboardStats: {
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalCustomers: 0
  },
  orders: [],
  currentOrder: null,
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    lastPage: false
  },
  isLoading: false,
  error: null
};

// Get dashboard statistics
export const fetchDashboardStats = createAsyncThunk(
  'seller/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      return await sellerService.getDashboardStats();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

// Get seller orders
export const fetchSellerOrders = createAsyncThunk(
  'seller/fetchSellerOrders',
  async ({ pageNumber, pageSize, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      return await sellerService.getSellerOrders(pageNumber, pageSize, sortBy, sortOrder);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Get order details
export const fetchSellerOrderById = createAsyncThunk(
  'seller/fetchSellerOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      return await sellerService.getSellerOrderById(orderId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

// Update order status
export const updateSellerOrderStatus = createAsyncThunk(
  'seller/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue, dispatch }) => {
    try {
      const result = await sellerService.updateOrderStatus(orderId, status);
      
      // Refresh orders list after status update
      dispatch(fetchSellerOrders({ pageNumber: 0, pageSize: 10, sortBy: 'orderDate', sortOrder: 'DESC' }));
      
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

// Seller slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearSellerError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch orders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.content || [];
        state.pagination = {
          pageNumber: action.payload.pageNumber || 0,
          pageSize: action.payload.pageSize || 10,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
          lastPage: action.payload.lastPage || false
        };
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.orders = [];
      })
      
      // Fetch order by ID
      .addCase(fetchSellerOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchSellerOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentOrder = null;
      })
      
      // Update order status
      .addCase(updateSellerOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSellerOrderStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateSellerOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSellerError, clearCurrentOrder } = sellerSlice.actions;
export default sellerSlice.reducer;