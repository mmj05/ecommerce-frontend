// src/services/api.js - Fixed for backend cookie-based auth
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // This is CRITICAL for cookie-based auth
  withCredentials: true
});

// Request interceptor - ensure credentials are always included
api.interceptors.request.use(
  (config) => {
    // Always include credentials to ensure cookies are sent
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      
      // If on a protected route and not already on login page, redirect to login
      if (!['/login', '/register'].includes(window.location.pathname)) {
        // Save current location for redirect after login
        localStorage.setItem('loginRedirect', window.location.pathname);
        // Clear user data
        localStorage.removeItem('user');
        // Redirect to login (optional - can be handled by components)
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;