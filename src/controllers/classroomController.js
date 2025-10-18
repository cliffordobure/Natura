const Classroom = require('../models/Classroom');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all classrooms
// @route   GET /api/v1/classrooms
// @access  Private
const getClassrooms = asyncHandler(async (req, res) => {
  const { schoolId } = req.query;

  // Build filter
  const filter = {};
  if (schoolId) filter.schoolId = schoolId;

  const classrooms = await Classroom.find(filter)
    .populate('schoolId')
    .populate('teacherIds')
    .populate('childrenIds');

  res.status(200).json({
    classrooms,
  });
});

// @desc    Get classroom by ID
// @route   GET /api/v1/classrooms/:classroomId
// @access  Private
const getClassroomById = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.classroomId)
    .populate('schoolId')
    .populate('teacherIds')
    .populate('childrenIds');

  if (!classroom) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  res.status(200).json(classroom);
});

// @desc    Create classroom
// @route   POST /api/v1/classrooms
// @access  Private (Admin only)
const createClassroom = asyncHandler(async (req, res) => {
  const {
    name,
    schoolId,
    description,
    teacherIds,
    capacity,
    ageGroup,
    roomImageUrl,
  } = req.body;

  // Validate required fields
  if (!name || !schoolId || !capacity || !ageGroup) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const classroom = await Classroom.create({
    name,
    schoolId,
    description,
    teacherIds,
    capacity,
    ageGroup,
    roomImageUrl,
  });

  res.status(201).json(classroom);
});

// @desc    Update classroom
// @route   PUT /api/v1/classrooms/:classroomId
// @access  Private (Admin only)
const updateClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.classroomId);

  if (!classroom) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  const {
    name,
    description,
    teacherIds,
    capacity,
    ageGroup,
    roomImageUrl,
    isActive,
  } = req.body;

  // Update fields
  if (name) classroom.name = name;
  if (description) classroom.description = description;
  if (teacherIds) classroom.teacherIds = teacherIds;
  if (capacity) classroom.capacity = capacity;
  if (ageGroup) classroom.ageGroup = ageGroup;
  if (roomImageUrl) classroom.roomImageUrl = roomImageUrl;
  if (typeof isActive !== 'undefined') classroom.isActive = isActive;

  await classroom.save();

  res.status(200).json(classroom);
});

// @desc    Delete classroom
// @route   DELETE /api/v1/classrooms/:classroomId
// @access  Private (Admin only)
const deleteClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.classroomId);

  if (!classroom) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  await classroom.deleteOne();

  res.status(200).json({
    message: 'Classroom deleted successfully',
  });
});

module.exports = {
  getClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
};

