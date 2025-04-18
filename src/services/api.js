// src/services/api.js - Updated to properly handle auth

import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for JWT cookie handling
});

// Add request interceptor for handling auth
api.interceptors.request.use(
  (config) => {
    // Check for JWT in localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.jwtToken;
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Ensure credentials are included
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error.response.data);
      
      // You could dispatch a logout action here if needed
      // localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;