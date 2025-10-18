const Child = require('../models/Child');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { USER_ROLES } = require('../config/constants');

// @desc    Get all children
// @route   GET /api/v1/children
// @access  Private
const getChildren = asyncHandler(async (req, res) => {
  const { classroomId, parentId } = req.query;

  // Build filter based on user role
  const filter = {};

  // Apply role-based filtering
  if (req.user.role === USER_ROLES.PARENT) {
    // Parents can only see their own children
    filter._id = { $in: req.user.childrenIds };
  } else if (req.user.role === USER_ROLES.TEACHER) {
    // Teachers can see children in their classrooms
    if (classroomId) {
      filter.classroomId = classroomId;
    } else {
      filter.classroomId = { $in: req.user.classroomIds };
    }
  } else {
    // Admin and directors can see all children
    if (classroomId) filter.classroomId = classroomId;
    if (parentId) filter.parentIds = parentId;
  }

  const children = await Child.find(filter)
    .populate('classroomId')
    .populate('schoolId')
    .populate('parentIds')
    .populate('authorizedPickupIds');

  res.status(200).json({
    children,
  });
});

// @desc    Get child by ID
// @route   GET /api/v1/children/:childId
// @access  Private
const getChildById = asyncHandler(async (req, res) => {
  const child = await Child.findById(req.params.childId)
    .populate('classroomId')
    .populate('schoolId')
    .populate('parentIds')
    .populate('authorizedPickupIds');

  if (!child) {
    res.status(404);
    throw new Error('Child not found');
  }

  // Check access
  if (req.user.role === USER_ROLES.PARENT) {
    const hasAccess = req.user.childrenIds.some(id => id.toString() === child._id.toString());
    if (!hasAccess) {
      res.status(403);
      throw new Error('Access denied');
    }
  } else if (req.user.role === USER_ROLES.TEACHER) {
    const hasAccess = req.user.classroomIds.some(id => id.toString() === child.classroomId._id.toString());
    if (!hasAccess) {
      res.status(403);
      throw new Error('Access denied');
    }
  }

  res.status(200).json(child);
});

// @desc    Create child
// @route   POST /api/v1/children
// @access  Private
const createChild = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    profileImageUrl,
    classroomId,
    schoolId,
    parentIds,
    authorizedPickupIds,
    allergies,
    medicalNotes,
    emergencyContact,
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !dateOfBirth || !gender || !classroomId || !schoolId || !parentIds || !emergencyContact) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const child = await Child.create({
    firstName,
    lastName,
    dateOfBirth,
    gender,
    profileImageUrl,
    classroomId,
    schoolId,
    parentIds,
    authorizedPickupIds,
    allergies,
    medicalNotes,
    emergencyContact,
  });

  // Update parent users with child ID
  await User.updateMany(
    { _id: { $in: parentIds } },
    { $addToSet: { childrenIds: child._id } }
  );

  res.status(201).json(child);
});

// @desc    Update child
// @route   PUT /api/v1/children/:childId
// @access  Private
const updateChild = asyncHandler(async (req, res) => {
  const child = await Child.findById(req.params.childId);

  if (!child) {
    res.status(404);
    throw new Error('Child not found');
  }

  // Check access for parents
  if (req.user.role === USER_ROLES.PARENT) {
    const hasAccess = req.user.childrenIds.some(id => id.toString() === child._id.toString());
    if (!hasAccess) {
      res.status(403);
      throw new Error('Access denied');
    }
  }

  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    profileImageUrl,
    classroomId,
    parentIds,
    authorizedPickupIds,
    allergies,
    medicalNotes,
    emergencyContact,
    isActive,
  } = req.body;

  // Update fields
  if (firstName) child.firstName = firstName;
  if (lastName) child.lastName = lastName;
  if (dateOfBirth) child.dateOfBirth = dateOfBirth;
  if (gender) child.gender = gender;
  if (profileImageUrl) child.profileImageUrl = profileImageUrl;
  if (classroomId) child.classroomId = classroomId;
  if (parentIds) child.parentIds = parentIds;
  if (authorizedPickupIds) child.authorizedPickupIds = authorizedPickupIds;
  if (allergies !== undefined) child.allergies = allergies;
  if (medicalNotes !== undefined) child.medicalNotes = medicalNotes;
  if (emergencyContact) child.emergencyContact = emergencyContact;
  if (typeof isActive !== 'undefined') child.isActive = isActive;

  await child.save();

  res.status(200).json(child);
});

// @desc    Delete child
// @route   DELETE /api/v1/children/:childId
// @access  Private (Admin only)
const deleteChild = asyncHandler(async (req, res) => {
  const child = await Child.findById(req.params.childId);

  if (!child) {
    res.status(404);
    throw new Error('Child not found');
  }

  // Remove child from parent users
  await User.updateMany(
    { childrenIds: child._id },
    { $pull: { childrenIds: child._id } }
  );

  await child.deleteOne();

  res.status(200).json({
    message: 'Child deleted successfully',
  });
});

module.exports = {
  getChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild,
};

