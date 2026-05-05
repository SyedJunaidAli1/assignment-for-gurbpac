import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This will be mocked in the service layer for now
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token if it exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
