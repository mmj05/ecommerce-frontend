// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

// Get cart from localStorage if available
const storedCart = localStorage.getItem('guestCart') 
  ? JSON.parse(localStorage.getItem('guestCart'))
  : { cartItems: [], totalPrice: 0 };

const initialState = {
  cartItems: storedCart.cartItems || [],
  totalPrice: storedCart.totalPrice || 0,
  isLoading: false,
  error: null,
  cartUpdated: 0, // Counter for tracking cart updates
  lastFetchTime: 0, // Track last fetch time to prevent duplicate fetches
};

// Get cart for authenticated user or guest
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth, cart } = getState();
      
      // Skip fetching if last fetch was very recent (300ms)
      const now = Date.now();
      if (now - cart.lastFetchTime < 300) {
        return {
          products: cart.cartItems,
          totalPrice: cart.totalPrice
        };
      }
      
      // Only fetch from API if user is authenticated
      if (auth.isAuthenticated) {
        try {
          const response = await cartService.getCart();
          // console.log('GetCart response:', response);
          return response;
        } catch (error) {
          // If the API call fails for an authenticated user, return empty cart
          if (error.response && (error.response.status === 404 || error.response.status === 400)) {
            // console.log('No cart found for authenticated user, returning empty cart');
            return { 
              products: [],
              totalPrice: 0 
            };
          }
          throw error; // Re-throw other errors
        }
      } else {
        // Return the local cart for guest users
        return { 
          products: cart.cartItems,
          totalPrice: cart.totalPrice 
        };
      }
    } catch (error) {
      console.error('Error in getCart thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart');
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      // console.log(`Adding product ID ${productId} with quantity ${quantity} to cart`);
      
      const { auth } = getState();
      if (auth.isAuthenticated) {
        // For authenticated users, add directly (backend handles duplicates)
        const response = await cartService.addToCart(productId, quantity);
        return response;
      } else {
        // For guest users, handle locally as before
        const { products } = getState();
        const product = products.products.find(p => p.productId === productId) || 
                        products.product; // For single product page
                        
        if (!product) {
          return rejectWithValue('Product not found');
        }
        
        // Create a cart item from the product
        const cartItem = {
          productId: product.productId,
          productName: product.productName,
          image: product.image || "https://via.placeholder.com/300",
          description: product.description,
          price: product.price,
          specialPrice: product.specialPrice || product.price,
          discount: product.discount || 0,
          quantity: quantity
        };
        
        return { 
          product: cartItem,
          isGuest: true 
        };
      }
    } catch (error) {
      console.error('Error in addToCart thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to add product to cart');
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, operation }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (auth.isAuthenticated) {
        // Update server cart if authenticated
        // Use the correct operation string that the backend expects
        const backendOperation = operation === 'increase' ? 'increase' : 'decrease';
        return await cartService.updateCartItem(productId, backendOperation);
      } else {
        // For guest users, update local cart
        const { cart } = getState();
        const cartItem = cart.cartItems.find(item => item.productId === productId);
        
        if (!cartItem) {
          return rejectWithValue('Product not found in cart');
        }
        
        const newQuantity = operation === 'increase' 
          ? cartItem.quantity + 1 
          : Math.max(cartItem.quantity - 1, 0);
        
        return { 
          productId, 
          quantity: newQuantity,
          isGuest: true
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

// Merge guest cart with user cart on login
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async (_, { getState, dispatch }) => {
    try {
      const { cart } = getState();
      
      // If no items in guest cart, just get the user's cart
      if (!cart.cartItems.length) {
        return await dispatch(getCart()).unwrap();
      }
      
              // console.log('Merging guest cart with user cart');
      
      // First get the current user's cart to compare with guest cart
      let userCart;
      try {
        userCart = await cartService.getCart();
      } catch (error) {
        console.warn('Error fetching user cart for merge:', error);
        userCart = { products: [] };
      }
      
      // Create a map of product IDs to products in the user's cart
      const userProducts = new Map();
      if (userCart.products && Array.isArray(userCart.products)) {
        userCart.products.forEach(product => {
          userProducts.set(product.productId.toString(), product);
        });
      }
      
      // Process each guest cart item
      for (const item of cart.cartItems) {
        try {
          const productId = item.productId.toString();
          const userItem = userProducts.get(productId);
          
          // If product exists in both carts, only update if guest quantity is higher
          if (userItem && userItem.quantity >= item.quantity) {
            // console.log(`Product ${productId} already in user cart with sufficient quantity (${userItem.quantity})`);
            continue;
          } else if (userItem) {
            // User has this product but with less quantity - update with the difference
            const quantityDiff = item.quantity - userItem.quantity;
            // console.log(`Product ${productId} in user cart but with less quantity. Adding ${quantityDiff} more.`);
            await cartService.addToCart(item.productId, quantityDiff);
          } else {
            // Product not in user cart - add it
            // console.log(`Adding new product ${productId} with quantity ${item.quantity} to user cart`);
            await cartService.addToCart(item.productId, item.quantity);
          }
        } catch (error) {
          console.warn(`Error adding item ${item.productId} to cart:`, error);
          // Continue with next item even if one fails
        }
      }
      
      // Clear the guest cart after successful merge
      localStorage.removeItem('guestCart');
      
      // Get the final cart state
      return await dispatch(getCart()).unwrap();
    } catch (error) {
      console.error("Error merging cart:", error);
      // If merging fails, still try to get current cart
      return await dispatch(getCart()).unwrap();
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ cartId, productId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      const { cartItems } = getState().cart;
      
      if (auth.isAuthenticated) {
        // Check if this is the last item in the cart
        const isLastItem = cartItems.length === 1 && cartItems[0].productId === productId;
        
        // Remove from server cart if authenticated
        await cartService.removeFromCart(cartId, productId);
        
        // If it was the last item, delete the empty cart
        if (isLastItem) {
          try {
            // console.log('Last item removed, deleting empty cart');
            await cartService.deleteEmptyCart();
                          // console.log('Empty cart deleted successfully after removing last item');
          } catch (error) {
            console.warn('Failed to delete empty cart after removing last item:', error);
          }
        }
        
        return { productId, isLastItem };
      } else {
        // For guest users, remove from local cart
        return { 
          productId,
          isGuest: true 
        };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to remove product from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState }) => {
    const { auth } = getState();
    
    // Clear local storage
    localStorage.removeItem('guestCart');
    
    return true;
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
        state.lastFetchTime = Date.now(); // Track when we last fetched
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
        
        if (action.payload.isGuest) {
          // Handle guest cart
          const newItem = action.payload.product;
          const existingItemIndex = state.cartItems.findIndex(
            item => item.productId === newItem.productId
          );
          
          if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            state.cartItems[existingItemIndex].quantity += newItem.quantity;
          } else {
            // Add new item
            state.cartItems.push(newItem);
          }
          
          // Recalculate total price
          state.totalPrice = state.cartItems.reduce(
            (total, item) => total + (item.specialPrice * item.quantity), 0
          );
          
          // Save to localStorage
          localStorage.setItem('guestCart', JSON.stringify({
            cartItems: state.cartItems,
            totalPrice: state.totalPrice
          }));
        } else {
          // Handle server cart response
          if (action.payload && (action.payload.products || action.payload.content)) {
            state.cartItems = action.payload.products || action.payload.content || [];
            state.totalPrice = action.payload.totalPrice || 0;
          }
        }
        
        // Increment the cartUpdated counter to trigger Header refresh
        state.cartUpdated += 1;
        state.lastFetchTime = Date.now(); // Track when we last updated
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
        
        if (action.payload.isGuest) {
          // Handle guest cart update
          const { productId, quantity } = action.payload;
          const itemIndex = state.cartItems.findIndex(item => item.productId === productId);
          
          if (itemIndex >= 0) {
            if (quantity <= 0) {
              // Remove item if quantity is zero
              state.cartItems.splice(itemIndex, 1);
            } else {
              // Update quantity
              state.cartItems[itemIndex].quantity = quantity;
            }
            
            // Recalculate total price
            state.totalPrice = state.cartItems.reduce(
              (total, item) => total + (item.specialPrice * item.quantity), 0
            );
            
            // Save to localStorage
            localStorage.setItem('guestCart', JSON.stringify({
              cartItems: state.cartItems,
              totalPrice: state.totalPrice
            }));
          }
        } else {
          // Handle server cart response
          state.cartItems = action.payload.products || [];
          state.totalPrice = action.payload.totalPrice || 0;
        }
        
        // Increment the cartUpdated counter to trigger Header refresh
        state.cartUpdated += 1;
        state.lastFetchTime = Date.now(); // Track when we last updated
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
        
        if (action.payload.isGuest) {
          // Handle guest cart removal
          const { productId } = action.payload;
          state.cartItems = state.cartItems.filter(item => item.productId !== productId);
          
          // Recalculate total price
          state.totalPrice = state.cartItems.reduce(
            (total, item) => total + (item.specialPrice * item.quantity), 0
          );
          
          // Save to localStorage
          localStorage.setItem('guestCart', JSON.stringify({
            cartItems: state.cartItems,
            totalPrice: state.totalPrice
          }));
        } else {
          // Handle server cart response - remove the item
          state.cartItems = state.cartItems.filter(
            item => item.productId !== action.payload.productId
          );
          
          // If it was the last item, reset the cart completely
          if (action.payload.isLastItem) {
            state.cartItems = [];
            state.totalPrice = 0;
          }
        }
        
        // Increment the cartUpdated counter to trigger Header refresh
        state.cartUpdated += 1;
        state.lastFetchTime = Date.now(); // Track when we last updated
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.products || [];
        state.totalPrice = action.payload.totalPrice || 0;
        // Clear guest cart
        localStorage.removeItem('guestCart');
        // Increment the cartUpdated counter to trigger Header refresh
        state.cartUpdated += 1;
        state.lastFetchTime = Date.now(); // Track when we last updated
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cartItems = [];
        state.totalPrice = 0;
        state.cartUpdated += 1;
        state.lastFetchTime = Date.now(); // Track when we last updated
      })
      .addCase(clearCart.rejected, (state) => {
        state.isLoading = false;
        // Even if server-side clearing fails, still clear client-side
        state.cartItems = [];
        state.totalPrice = 0;
        state.cartUpdated += 1;
      });
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;