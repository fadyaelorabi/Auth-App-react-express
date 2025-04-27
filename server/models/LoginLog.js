const mongoose = require('mongoose');

// Define the schema for a LoginLog
const loginLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // Reference to the User model
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now  // Store the time of login
  },
  ip_address: {
    type: String,
    required: true  // Record the IP address of the user
  },
  user_agent: {
    type: String,
    required: true  // Record the user-agent for the device/browser information
  }
});

// Define the LoginLog model based on the schema
const LoginLog = mongoose.model('LoginLog', loginLogSchema);

module.exports = LoginLog;
