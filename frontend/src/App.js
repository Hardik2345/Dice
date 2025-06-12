import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import OTPVerification from './components/OTPVerification';
import DiceRoll from './components/DiceRoll';
import RewardScreen from './components/RewardScreen';
import api from './services/api';

function App() {
  const [currentStep, setCurrentStep] = useState('login');
  const [userInfo, setUserInfo] = useState(null);
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ mongodb: false, shopify: false });

  useEffect(() => {
    checkSessionStatus();
    checkBackendHealth();
  }, []);

  const checkSessionStatus = async () => {
    try {
      const response = await api.getStatus();
      if (response.data.verified && response.data.userInfo) {
        setUserInfo(response.data.userInfo);
        setCurrentStep('dice');
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBackendHealth = async () => {
    try {
      const response = await api.getHealth();
      setBackendStatus({
        mongodb: response.data.mongodb === 'connected',
        shopify: response.data.shopify === 'connected'
      });
    } catch (error) {
      console.error('Health check error:', error);
    }
  };

  const handleLoginSubmit = (info) => {
    setUserInfo(info);
    setCurrentStep('otp');
  };

  const handleOTPVerified = () => {
    setCurrentStep('dice');
  };

  const handleDiceRolled = (rewardData) => {
    setReward(rewardData);
    setCurrentStep('reward');
  };

  const handleReset = () => {
    setCurrentStep('login');
    setUserInfo(null);
    setReward(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="app-container">
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-container">
        {/* Backend Status Indicator */}
        <div className="backend-status">
          <span className={`status-indicator ${backendStatus.mongodb ? 'connected' : 'disconnected'}`}>
            DB: {backendStatus.mongodb ? '✓' : '✗'}
          </span>
          <span className={`status-indicator ${backendStatus.shopify ? 'connected' : 'disconnected'}`}>
            Shopify: {backendStatus.shopify ? '✓' : '✗'}
          </span>
        </div>

        {currentStep === 'login' && (
          <LoginForm onSubmit={handleLoginSubmit} />
        )}
        {currentStep === 'otp' && (
          <OTPVerification 
            mobile={userInfo?.mobile} 
            onVerified={handleOTPVerified} 
          />
        )}
        {currentStep === 'dice' && (
          <DiceRoll onRollComplete={handleDiceRolled} />
        )}
        {currentStep === 'reward' && (
          <RewardScreen 
            reward={reward} 
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;