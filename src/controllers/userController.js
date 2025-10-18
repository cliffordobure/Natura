const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { getPaginationParams, createPagination, getSortParams } = require('../utils/pagination');
const { USER_ROLES } = require('../config/constants');

// @desc    Get current user
// @route   GET /api/v1/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('schoolId')
    .populate('classroomIds')
    .populate('childrenIds');

  res.status(200).json(user);
});

// @desc    Update current user
// @route   PUT /api/v1/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, profileImageUrl } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (profileImageUrl) user.profileImageUrl = profileImageUrl;

  await user.save();

  res.status(200).json(user);
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin only)
const getUsers = asyncHandler(async (req, res) => {
  const { role, schoolId } = req.query;
  const { page, limit, skip } = getPaginationParams(req.query);
  const sort = getSortParams(req.query);

  // Build filter
  const filter = {};
  if (role) filter.role = role;
  if (schoolId) filter.schoolId = schoolId;

  // Get users
  const users = await User.find(filter)
    .populate('schoolId')
    .populate('classroomIds')
    .populate('childrenIds')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count
  const total = await User.countDocuments(filter);

  res.status(200).json({
    users,
    pagination: createPagination(page, limit, total),
  });
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:userId
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)
    .populate('schoolId')
    .populate('classroomIds')
    .populate('childrenIds');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(user);
});

// @desc    Create user
// @route   POST /api/v1/users
// @access  Private (Admin only)
const createUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, role, schoolId, classroomIds, childrenIds } = req.body;

  // Validate required fields
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
    classroomIds,
    childrenIds,
  });

  res.status(201).json(user);
});

// @desc    Update user
// @route   PUT /api/v1/users/:userId
// @access  Private (Admin only)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const {
    firstName,
    lastName,
    phoneNumber,
    profileImageUrl,
    role,
    isActive,
    classroomIds,
    childrenIds,
  } = req.body;

  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (profileImageUrl) user.profileImageUrl = profileImageUrl;
  if (role) user.role = role;
  if (typeof isActive !== 'undefined') user.isActive = isActive;
  if (classroomIds) user.classroomIds = classroomIds;
  if (childrenIds) user.childrenIds = childrenIds;

  await user.save();

  res.status(200).json(user);
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:userId
// @access  Private (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.status(200).json({
    message: 'User deleted successfully',
  });
});

module.exports = {
  getMe,
  updateMe,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

