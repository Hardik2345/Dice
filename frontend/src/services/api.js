import axios from 'axios';

const api = axios.create({
  baseURL: process.env.RENDER_APP_API_URL || 'https://dice-1-ttat.onrender.com', // fallback for local dev
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API baseURL:', process.env.RENDER_APP_API_URL || 'https://dice-1-ttat.onrender.com');

export default {
  sendOTP: (data) => api.post('/api/send-otp', data),
  verifyOTP: (otp) => api.post('/api/verify-otp', { otp }),
  rollDice: () => api.post('/api/roll-dice'),
  getStatus: () => api.get('/api/status')
};
