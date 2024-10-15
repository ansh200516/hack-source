// src/api/axios.js

import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5213/api',
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or retrieve from context if using Context API
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;