import axios from 'axios';

// Use REACT_APP_ prefix for Create React App environment variables
const API_URL = process.env.RENDER_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default {
  sendOTP: (data) => api.post('/api/send-otp', data),
  verifyOTP: (otp) => api.post('/api/verify-otp', { otp }),
  rollDice: () => api.post('/api/roll-dice'),
  getStatus: () => api.get('/api/status'),
  checkDiscountStatus: (code) => api.get(`/api/discount-status/${code}`),
  getHealth: () => api.get('/api/health')
};