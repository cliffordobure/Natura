const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken, generateRefreshToken, verifyRefreshToken, generateResetToken } = require('../utils/jwt');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/email');
const crypto = require('crypto');

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password: password ? '[PROVIDED]' : '[MISSING]' });

  // Validate input
  if (!email || !password) {
    console.log('Missing email or password');
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  console.log('User found:', user ? 'YES' : 'NO');

  if (!user) {
    console.log('User not found for email:', email);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is inactive');
  }

  // Check password
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  // Populate user data
  await user.populate('schoolId');
  await user.populate('classroomIds');
  await user.populate('childrenIds');

  res.status(200).json({
    token,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive,
      schoolId: user.schoolId?._id,
      classroomIds: user.classroomIds.map(c => c._id),
      childrenIds: user.childrenIds.map(c => c._id),
    },
  });
});

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, role, schoolId } = req.body;

  // Validate input
  if (!email || !password || !firstName || !lastName || !role || !schoolId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    role,
    schoolId,
  });

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Send welcome email
  try {
    await sendWelcomeEmail(email, firstName);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }

  res.status(201).json({
    token,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive,
      schoolId: user.schoolId,
      classroomIds: user.classroomIds,
      childrenIds: user.childrenIds,
    },
  });
});

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token
  const user = await User.findById(req.user._id);
  user.refreshToken = null;
  await user.save();

  res.status(200).json({
    message: 'Logged out successfully',
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide email');
  }

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists or not
    res.status(200).json({
      message: 'Password reset email sent',
    });
    return;
  }

  // Generate reset token
  const resetToken = generateResetToken();

  // Save reset token and expiry
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email
  try {
    await sendPasswordResetEmail(email, resetToken);
    res.status(200).json({
      message: 'Password reset email sent',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400);
    throw new Error('Please provide token and new password');
  }

  // Hash token
  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    message: 'Password reset successful',
  });
});

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};

