const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for a User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Name is required
    trim: true       // Remove extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,    // Email should be unique in the database
    lowercase: true  // Store email in lowercase
  },
  password: {
    type: String,
    required: true
  },
  auth_method: {
    type: String,
    default: 'manual'  // Set default to 'manual' for regular sign-ups
  },
  created_at: {
    type: Date,
    default: Date.now  // Store the current timestamp when the user is created
  }
});

// Define the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
