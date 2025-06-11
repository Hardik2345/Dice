import React, { useState } from 'react';
import api from '../services/api';

function DiceRoll({ onRollComplete }) {
  const [rolling, setRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [error, setError] = useState('');

  const rollDice = async () => {
    setRolling(true);
    setError('');
    
    // Animate dice rolling
    const animationDuration = 2000;
    const animationInterval = 100;
    const iterations = animationDuration / animationInterval;
    
    let count = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      count++;
      
      if (count >= iterations) {
        clearInterval(interval);
        // Make API call
        makeApiCall();
      }
    }, animationInterval);
  };

  const makeApiCall = async () => {
    try {
      const response = await api.rollDice();
      if (response.data.success) {
        setDiceValue(response.data.diceResult);
        setTimeout(() => {
          onRollComplete(response.data);
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to roll dice');
      setRolling(false);
    }
  };

  const getDiceFace = (value) => {
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[value - 1];
  };

  return (
    <div className="dice-roll">
      <h2 className="title">Roll the Dice!</h2>
      <p className="subtitle">Tap the dice to reveal your discount</p>
      
      <div className="dice-container">
        <div 
          className={`dice ${rolling ? 'rolling' : ''}`}
          onClick={!rolling ? rollDice : undefined}
        >
          <span className="dice-face">{getDiceFace(diceValue)}</span>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={rollDice} 
        className="btn btn-primary"
        disabled={rolling}
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
}

export default DiceRoll;