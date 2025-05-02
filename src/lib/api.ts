import axios from 'axios';

// Axios instance with base URL
export const api = axios.create({
  baseURL: '/',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Try to get user details from localStorage
    const userDetailsString = localStorage.getItem('userDetails');

    if (userDetailsString) {
      try {
        const userDetails = JSON.parse(userDetailsString);

        // Add authorization header if token exists
        if (userDetails.token) {
          config.headers['Authorization'] = `Bearer ${userDetails.token}`;
        }
      } catch (error) {
        console.error('Error parsing user details:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
