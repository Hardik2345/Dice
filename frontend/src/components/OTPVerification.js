import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

function OTPVerification({ mobile, onVerified }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newOtp.every(digit => digit) && index === 5) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (otpString = null) => {
  const otpValue = otpString || otp.join('');
  
  if (otpValue.length !== 6) {
    setError('Please enter complete OTP');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const response = await api.verifyOTP(otpValue);
    console.log('Response:', response); // Debug log
    
    // Access response.data instead of just response
    if (response.data && response.data.success) {
      onVerified();
    } else {
      setError('Invalid OTP');
    }
  } catch (err) {
    console.error('Error:', err);
    setError(err.response?.data?.error || 'Invalid OTP');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="otp-verification">
      <h2 className="title">Verify OTP</h2>
      <p className="subtitle">
        Enter the OTP sent to<br />
        <strong>{mobile}</strong>
      </p>
      
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="otp-input"
            disabled={loading}
          />
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      <div className="success-message">For testing, use OTP: 123456</div>
      
      <button 
        onClick={() => handleSubmit()} 
        className="btn btn-primary"
        disabled={loading || !otp.every(digit => digit)}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
}

export default OTPVerification;