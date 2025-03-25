import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

const initialState = {
  cartItems: [],
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Get cart
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart');
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(productId, quantity);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product to cart');
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, operation }, { rejectWithValue }) => {
    try {
      return await cartService.updateCartItem(productId, operation);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

// Remove product from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      await cartService.removeFromCart(cartId, productId);
      return { productId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove product from cart');
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.products || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.products || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.products || [];
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = state.cartItems.filter(
          item => item.productId !== action.payload.productId
        );
        // Note: The total price will be updated on the next getCart call
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;