import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import OTPVerification from './components/OTPVerification';
import DiceRoll from './components/DiceRoll';
import RewardScreen from './components/RewardScreen';

function App() {
  const [currentStep, setCurrentStep] = useState('login');
  const [userInfo, setUserInfo] = useState(null);
  const [reward, setReward] = useState(null);

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

  return (
    <div className="app">
      <div className="app-container">
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