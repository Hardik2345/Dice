import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', // fallback for local dev
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API baseURL:', process.env.NEXT_PUBLIC_API_URL);

export default {
  sendOTP: (data) => api.post('/api/send-otp', data),
  verifyOTP: (otp) => api.post('/api/verify-otp', { otp }),
  rollDice: () => api.post('/api/roll-dice'),
  getStatus: () => api.get('/api/status')
};
