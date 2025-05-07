// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { clearCart, mergeCart } from '../cart/cartSlice';

// Check if user info is stored in localStorage
const storedUser = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user'))
  : null;

// Initial state
const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  isLoading: false,
  authChecked: false,
  error: null,
};

// Login user
// Update the login action in src/features/auth/authSlice.js
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login(userData);
      
      // Log the response to see what we're getting
      console.log('Login response:', response);
      
      // Make sure jwtToken is properly extracted from the response
      const processedResponse = {
        ...response,
        // If jwtToken isn't already included, try to get it from headers or response
        jwtToken: response.jwtToken || 
                  response.token || 
                  response.accessToken ||
                  (response.headers && response.headers.authorization)
      };
      
      console.log('Processed response:', processedResponse);
      
      // Store user in localStorage with token
      localStorage.setItem('user', JSON.stringify(processedResponse));
      
      // After successful login, merge guest cart with user cart
      dispatch(mergeCart());
      
      return processedResponse;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }
);

// Logout user - Enhanced to ensure cart clearing works
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await authService.logout();
      // Remove user from localStorage
      localStorage.removeItem('user');
      // Clear the cart when logging out
      dispatch(clearCart());
      return null;
    } catch (error) {
      // Even if logout API fails, we still want to remove the user from localStorage
      localStorage.removeItem('user');
      dispatch(clearCart());
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Other async thunks remain the same
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      if (!localStorage.getItem('user')) {
        return null;
      }
      
      const response = await authService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error) {
      localStorage.removeItem('user');
      console.log('Failed to get current user:', error);
      return null;
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request password reset');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Add a manual logout action for use in emergency cases
    manualLogout: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.authChecked = true;
      // Note: We rely on the clearCart action being dispatched separately
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.authChecked = true;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.authChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.authChecked = true;
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })
      
      // Logout - Make sure we handle this correctly
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
        // Note: The cart should already be cleared via the dispatch(clearCart()) in the thunk
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })
      
      // Password reset flows remain the same
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, manualLogout } = authSlice.actions;
export default authSlice.reducer;