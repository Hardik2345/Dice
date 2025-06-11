const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileHash: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  discountCode: {
    type: String,
    required: true
  },
  diceResult: {
    type: Number,
    required: true
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);