// src/services/api.js - Enhanced for header-based authentication
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // No longer needed for header-based auth
  withCredentials: false,
  timeout: 10000, // 10 second timeout
});

// Request interceptor - add Authorization header
api.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.jwtToken) {
          config.headers.Authorization = `Bearer ${userData.jwtToken}`;
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Log request details for debugging
    // console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
    //   headers: config.headers
    // });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - enhanced error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    // console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      const { status, config, data } = error.response;
      console.error(`API Error: ${status} ${config.method?.toUpperCase()} ${config.url}`, {
        status,
        data,
        headers: error.response.headers
      });

      // Handle authentication errors (401)
      if (status === 401) {
        console.warn('Authentication error detected. Clearing user data.');
        
        // Clear user data immediately
        localStorage.removeItem('user');
        
        // If on a protected route and not already on login/register page
        const currentPath = window.location.pathname;
        if (!['/login', '/register', '/', '/products'].includes(currentPath)) {
          // Save current location for redirect after login
          localStorage.setItem('loginRedirect', currentPath);
          
          // Show user-friendly message
          console.warn('Session expired. Please log in again.');
          
          // Optional: Trigger a custom event that components can listen to
          window.dispatchEvent(new CustomEvent('auth-error', { 
            detail: { message: 'Session expired. Please log in again.' } 
          }));
        }
      }
    } else if (error.request) {
      console.error('Network error - no response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;