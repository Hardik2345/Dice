import React, { useState } from 'react';

function RewardScreen({ reward, onReset }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reward.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDiceFace = (value) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1];
  };

  return (
    <div className="reward-screen">
      <div className="celebration">🎉</div>
      
      <h2 className="title">Congratulations!</h2>
      
      <div className="dice-result">
        <span className="dice-face-small">{getDiceFace(reward.diceResult)}</span>
      </div>
      
      <p className="reward-message">
        You rolled a {reward.diceResult} and won
      </p>
      
      <div className="discount-amount">{reward.discount} OFF</div>
      
      <div className="discount-code-container">
        <div className="discount-code">
          <span className="code-label">Your Code:</span>
          <span className="code-value">{reward.discountCode}</span>
        </div>
        
        <button 
          className="copy-button"
          onClick={copyToClipboard}
          title="Copy code"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
      
      {copied && <div className="success-message">Code copied!</div>}
      
      <button 
        className="btn btn-primary shop-now"
        onClick={() => window.location.href = 'https://your-store.myshopify.com'}
      >
        Shop Now
      </button>
      
      <button 
        className="btn btn-secondary"
        onClick={onReset}
      >
        Share with Friends
      </button>
    </div>
  );
}

export default RewardScreen;