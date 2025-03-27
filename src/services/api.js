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
    // You can add token logic here if needed, though you're using cookies
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
    if (error.response && error.response.status === 401) {
      // Instead of directly redirecting, let Redux handle this
      // This prevents automatic redirects during app initialization
      console.log('401 Unauthorized - Not automatically redirecting');
      // We could dispatch a logout action here if needed
      // store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;