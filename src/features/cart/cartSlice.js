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
        const response = await cartService.addToCart(productId, quantity);
        console.log('Server response after adding to cart:', response);
        return response; // Ensure we're returning the complete server response
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
            console.log('Last item removed, deleting empty cart');
            await cartService.deleteEmptyCart();
            console.log('Empty cart deleted successfully after removing last item');
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

export const deleteEmptyCart = createAsyncThunk(
  'cart/deleteEmptyCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.deleteEmptyCart();
      console.log('Delete empty cart response:', response);
      return response;
    } catch (error) {
      console.error('Error deleting empty cart:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete empty cart');
    }
  }
);

export const checkAndDeleteEmptyCart = () => async (dispatch, getState) => {
  const { cart, auth } = getState();
  
  // Only proceed if authenticated and cart is empty
  if (auth.isAuthenticated && cart.cartItems.length === 0) {
    console.log('Cart is empty, attempting to delete from database');
    try {
      await dispatch(deleteEmptyCart()).unwrap();
      console.log('Empty cart deleted successfully');
    } catch (err) {
      console.warn('Failed to delete empty cart:', err);
    }
  }
};

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
          if (action.payload && (action.payload.products || action.payload.content)) {
            state.cartItems = action.payload.products || action.payload.content || [];
            state.totalPrice = action.payload.totalPrice || 0;
          }
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
          
          // If it was the last item, reset the cart completely
          if (action.payload.isLastItem) {
            state.cartItems = [];
            state.totalPrice = 0;
          }
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
      })
      .addCase(deleteEmptyCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEmptyCart.fulfilled, (state) => {
        state.isLoading = false;
        // The cart is now deleted on the server, keep our local state in sync
        console.log('Cart deletion successful, updating local state');
      })
      .addCase(deleteEmptyCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.warn('Failed to delete empty cart:', action.payload);
      })
  },
});

export const { clearCartError, clearCart } = cartSlice.actions;
export default cartSlice.reducer;