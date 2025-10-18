const School = require('../models/School');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all schools
// @route   GET /api/v1/schools
// @access  Private
const getSchools = asyncHandler(async (req, res) => {
  const schools = await School.find()
    .populate('directorId')
    .populate('classroomIds');

  res.status(200).json({
    schools,
  });
});

// @desc    Get school by ID
// @route   GET /api/v1/schools/:schoolId
// @access  Private
const getSchoolById = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.schoolId)
    .populate('directorId')
    .populate('classroomIds');

  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }

  res.status(200).json(school);
});

// @desc    Create school
// @route   POST /api/v1/schools
// @access  Private (Admin only)
const createSchool = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    city,
    state,
    zipCode,
    phoneNumber,
    email,
    logoUrl,
    websiteUrl,
    directorId,
  } = req.body;

  // Validate required fields
  if (!name || !address || !city || !state || !zipCode || !phoneNumber || !email) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const school = await School.create({
    name,
    address,
    city,
    state,
    zipCode,
    phoneNumber,
    email,
    logoUrl,
    websiteUrl,
    directorId,
  });

  res.status(201).json(school);
});

// @desc    Update school
// @route   PUT /api/v1/schools/:schoolId
// @access  Private (Admin only)
const updateSchool = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.schoolId);

  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }

  const {
    name,
    address,
    city,
    state,
    zipCode,
    phoneNumber,
    email,
    logoUrl,
    websiteUrl,
    directorId,
    isActive,
  } = req.body;

  // Update fields
  if (name) school.name = name;
  if (address) school.address = address;
  if (city) school.city = city;
  if (state) school.state = state;
  if (zipCode) school.zipCode = zipCode;
  if (phoneNumber) school.phoneNumber = phoneNumber;
  if (email) school.email = email;
  if (logoUrl) school.logoUrl = logoUrl;
  if (websiteUrl) school.websiteUrl = websiteUrl;
  if (directorId) school.directorId = directorId;
  if (typeof isActive !== 'undefined') school.isActive = isActive;

  await school.save();

  res.status(200).json(school);
});

// @desc    Delete school
// @route   DELETE /api/v1/schools/:schoolId
// @access  Private (Admin only)
const deleteSchool = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.schoolId);

  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }

  await school.deleteOne();

  res.status(200).json({
    message: 'School deleted successfully',
  });
});

module.exports = {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
};

