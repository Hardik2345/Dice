import React, { useState } from 'react';
import api from '../services/api';

function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.sendOTP(formData);
      // Fixed: Access response.data.success instead of response.success
      if (response.data && response.data.success) {
        onSubmit(formData);
      }
    } catch (err) {
      console.error('Error details:', err);
      if (err.response?.data?.alreadyPlayed) {
        setError('You have already played this game!');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h1 className="title">🎲 Roll & Win!</h1>
      <p className="subtitle">Enter your details to start playing</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            maxLength="10"
            disabled={loading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Get OTP'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;