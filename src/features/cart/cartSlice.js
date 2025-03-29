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
};

// Get cart for authenticated user
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Only fetch from API if user is authenticated
      const { auth } = getState();
      if (auth.isAuthenticated) {
        return await cartService.getCart();
      } else {
        // Return the local cart for guest users
        return { 
          products: getState().cart.cartItems,
          totalPrice: getState().cart.totalPrice 
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get cart');
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { auth } = getState();
      if (auth.isAuthenticated) {
        // Add to server cart if authenticated
        return await cartService.addToCart(productId, quantity);
      } else {
        // For guest users, add to local cart
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
        return await cartService.updateCartItem(productId, operation);
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

// Remove product from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ cartId, productId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (auth.isAuthenticated) {
        // Remove from server cart if authenticated
        await cartService.removeFromCart(cartId, productId);
        return { productId };
      } else {
        // For guest users, remove from local cart
        return { 
          productId,
          isGuest: true 
        };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove product from cart');
    }
  }
);

// Merge guest cart with user cart on login
export const mergeCart = createAsyncThunk(
  'cart/mergeCart',
  async (_, { getState, dispatch }) => {
    const { cart } = getState();
    
    // If there are items in the guest cart, add them to the user's cart
    if (cart.cartItems.length > 0) {
      for (const item of cart.cartItems) {
        await dispatch(addToCart({ 
          productId: item.productId, 
          quantity: item.quantity 
        }));
      }
      
      // Clear the guest cart from localStorage
      localStorage.removeItem('guestCart');
    }
    
    // Fetch the updated cart
    return dispatch(getCart()).unwrap();
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
    clearCart: (state) => {
      state.cartItems = [];
      state.totalPrice = 0;
      // Clear guest cart from localStorage
      localStorage.removeItem('guestCart');
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
          state.cartItems = action.payload.products || [];
          state.totalPrice = action.payload.totalPrice || 0;
        }
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
          // Note: The total price will be updated on the next getCart call
        }
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
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;