// src/services/api.js - Updated to properly handle auth

import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/',  // Note the trailing slash
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for JWT cookie handling
});

// Add request interceptor for handling auth
api.interceptors.request.use(
  (config) => {
    // Try to get JWT from localStorage
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        // Look for token in different possible formats
        const token = user.jwtToken || user.token || user.accessToken;
        
        if (token) {
          // If token exists, add it to Authorization header
          config.headers['Authorization'] = `Bearer ${token}`;
          console.log('Added token to request:', config.url);
        } else {
          console.warn('No token found in user data for request:', config.url);
        }
      } else {
        console.warn('No user data in localStorage for request:', config.url);
      }
    } catch (error) {
      console.error('Error setting auth header:', error);
    }
    
    // Ensure credentials are included
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses if needed
    // console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      
      // You could dispatch a logout action here if needed
      // This is a simplified approach - in a real app, you might want to use
      // a refresh token flow or redirect to login
      
      // Check for auth-related errors and update UI
      const errorData = error.response.data;
      if (errorData && 
         (errorData.error === 'Unauthorized' || 
          errorData.message?.includes('authentication'))) {
        
        // Consider auto-redirecting to login
        // if (window.location.pathname !== '/login') {
        //   window.location.href = '/login';
        // }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;