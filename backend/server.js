const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

const User = require('./models/User');

const app = express();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://dice-gamma-mocha.vercel.app'],
    credentials: true,
  })
);

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dice-roll-secret',
  resave: true, // Change to true
  saveUninitialized: true, // Make sure this is true
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 30,
    sameSite: 'lax' // Add this
  },
  name: 'dice-roll-session' // Add this to avoid conflicts
}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dice-roll-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Hardcoded OTP for development
const HARDCODED_OTP = '123456';

// Discount code mappings
const DISCOUNT_CODES = {
  1: { code: 'DICE10', discount: '10%' },
  2: { code: 'DICE15', discount: '15%' },
  3: { code: 'DICE20', discount: '20%' },
  4: { code: 'DICE25', discount: '25%' },
  5: { code: 'DICE30', discount: '30%' },
  6: { code: 'DICE50', discount: '50%' }
};

// Helper function to hash mobile number
const hashMobile = async (mobile) => {
  return await bcrypt.hash(mobile, 10);
};

// Routes

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and mobile number required' });
    }

    // Check if user has already played
    const existingUsers = await User.find({});
    
    for (let user of existingUsers) {
      const isMatch = await bcrypt.compare(mobile, user.mobileHash);
      if (isMatch) {
        return res.status(400).json({ 
          error: 'You have already played this game!',
          alreadyPlayed: true 
        });
      }
    }

    // Store user info in session
    req.session.userInfo = { name, mobile };

    // In production, integrate with actual OTP service
    console.log(`OTP for ${mobile}: ${HARDCODED_OTP}`);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      debug: 'Use OTP: 123456' // Remove in production
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  console.log('Verify OTP called with:', req.body);
  console.log('Session ID:', req.sessionID);
  console.log('Full session data:', req.session);
  console.log('User info in session:', req.session.userInfo);
  
  try {
    const { otp } = req.body;

    if (!req.session.userInfo) {
      console.log('ERROR: No user info in session!');
      return res.status(400).json({ error: 'Session expired. Please start again.' });
    }

    if (otp !== HARDCODED_OTP) {
      console.log('ERROR: OTP mismatch!', 'Received:', otp, 'Expected:', HARDCODED_OTP);
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark session as verified
    req.session.verified = true;
    console.log('SUCCESS: OTP verified!');

    res.json({ 
      success: true, 
      message: 'OTP verified successfully' 
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Roll dice endpoint
app.post('/api/roll-dice', async (req, res) => {
  try {
    if (!req.session.verified || !req.session.userInfo) {
      return res.status(401).json({ error: 'Unauthorized. Please verify OTP first.' });
    }

    const { name, mobile } = req.session.userInfo;

    // Double-check if user has already played
    const existingUsers = await User.find({});
    for (let user of existingUsers) {
      const isMatch = await bcrypt.compare(mobile, user.mobileHash);
      if (isMatch) {
        return res.status(400).json({ 
          error: 'You have already played this game!',
          alreadyPlayed: true 
        });
      }
    }

    // Generate dice result (1-6)
    const diceResult = Math.floor(Math.random() * 6) + 1;
    const discountInfo = DISCOUNT_CODES[diceResult];

    // In production, you would create unique codes via Shopify API
    // For now, using pre-defined codes
    const discountCode = `${discountInfo.code}_${Date.now()}`;

    // Hash mobile number for storage
    const mobileHash = await hashMobile(mobile);

    // Save user record
    const newUser = new User({
      mobileHash,
      name,
      discountCode,
      diceResult
    });

    await newUser.save();

    // Clear session
    req.session.destroy();

    res.json({
      success: true,
      diceResult,
      discountCode,
      discount: discountInfo.discount,
      message: `Congratulations! You won ${discountInfo.discount} off!`
    });
  } catch (error) {
    console.error('Roll dice error:', error);
    res.status(500).json({ error: 'Failed to process dice roll' });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    verified: req.session.verified || false,
    userInfo: req.session.userInfo || null
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});