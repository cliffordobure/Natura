const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Generate reset password token
const generateResetToken = () => {
  return jwt.sign({ purpose: 'reset' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
};

