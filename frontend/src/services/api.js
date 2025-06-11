import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  sendOTP: (data) => api.post('/api/send-otp', data),
  verifyOTP: (otp) => api.post('/api/verify-otp', { otp }),
  rollDice: () => api.post('/api/roll-dice'),
  getStatus: () => api.get('/api/status')
};