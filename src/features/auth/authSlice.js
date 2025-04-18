import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Check if user info is stored in localStorage
const storedUser = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user'))
  : null;

// Initial state
const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  isLoading: false,
  authChecked: false, // Add a new flag to track if we've checked auth state
  error: null,
};

// Login user action in auth/authSlice.js
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
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
      
      return processedResponse;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }
);

// Register user
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

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // If no token/user in localStorage, don't even make the request
      if (!localStorage.getItem('user')) {
        return null;
      }
      
      const response = await authService.getCurrentUser();
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(response));
      return response;
    } catch (error) {
      // If getting current user fails, remove from localStorage
      localStorage.removeItem('user');
      console.log('Failed to get current user:', error);
      return null;
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      // Remove user from localStorage
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      // Even if logout API fails, we still want to remove the user from localStorage
      localStorage.removeItem('user');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Request password reset
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

// Reset password
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
        // We don't set authenticated here, user should log in after registration
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
        // Only set as authenticated if we actually got user data
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
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })
      .addCase(logout.rejected, (state) => {
        // Even if the API call fails, we still want to log the user out locally
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      })
      
      // Request password reset
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
      
      // Reset password
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

export const { clearError } = authSlice.actions;
export default authSlice.reducer;