const LearningActivity = require('../models/LearningActivity');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get learning activities
// @route   GET /api/v1/learning-activities
// @access  Private
const getLearningActivities = asyncHandler(async (req, res) => {
  const { ageGroup, domain } = req.query;

  // Build filter
  const filter = {};
  if (ageGroup) filter.ageGroup = ageGroup;
  if (domain) filter.domain = domain;

  const learningActivities = await LearningActivity.find(filter)
    .populate('createdBy')
    .sort({ createdAt: -1 });

  res.status(200).json({
    learningActivities,
  });
});

// @desc    Get learning activity by ID
// @route   GET /api/v1/learning-activities/:activityId
// @access  Private
const getLearningActivityById = asyncHandler(async (req, res) => {
  const learningActivity = await LearningActivity.findById(req.params.activityId)
    .populate('createdBy');

  if (!learningActivity) {
    res.status(404);
    throw new Error('Learning activity not found');
  }

  res.status(200).json(learningActivity);
});

// @desc    Create learning activity
// @route   POST /api/v1/learning-activities
// @access  Private (Teachers and above)
const createLearningActivity = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    domain,
    ageGroup,
    objectives,
    instructions,
    materialNeeded,
    durationMinutes,
  } = req.body;

  // Validate required fields
  if (!title || !description || !domain || !ageGroup) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const learningActivity = await LearningActivity.create({
    title,
    description,
    domain,
    ageGroup,
    objectives,
    instructions,
    materialNeeded,
    durationMinutes,
    createdBy: req.user._id,
  });

  res.status(201).json(learningActivity);
});

// @desc    Update learning activity
// @route   PUT /api/v1/learning-activities/:activityId
// @access  Private (Teachers and above)
const updateLearningActivity = asyncHandler(async (req, res) => {
  const learningActivity = await LearningActivity.findById(req.params.activityId);

  if (!learningActivity) {
    res.status(404);
    throw new Error('Learning activity not found');
  }

  const {
    title,
    description,
    domain,
    ageGroup,
    objectives,
    instructions,
    materialNeeded,
    durationMinutes,
  } = req.body;

  // Update fields
  if (title) learningActivity.title = title;
  if (description) learningActivity.description = description;
  if (domain) learningActivity.domain = domain;
  if (ageGroup) learningActivity.ageGroup = ageGroup;
  if (objectives) learningActivity.objectives = objectives;
  if (instructions) learningActivity.instructions = instructions;
  if (materialNeeded) learningActivity.materialNeeded = materialNeeded;
  if (durationMinutes) learningActivity.durationMinutes = durationMinutes;

  await learningActivity.save();

  res.status(200).json(learningActivity);
});

// @desc    Delete learning activity
// @route   DELETE /api/v1/learning-activities/:activityId
// @access  Private (Teachers and above)
const deleteLearningActivity = asyncHandler(async (req, res) => {
  const learningActivity = await LearningActivity.findById(req.params.activityId);

  if (!learningActivity) {
    res.status(404);
    throw new Error('Learning activity not found');
  }

  await learningActivity.deleteOne();

  res.status(200).json({
    message: 'Learning activity deleted successfully',
  });
});

module.exports = {
  getLearningActivities,
  getLearningActivityById,
  createLearningActivity,
  updateLearningActivity,
  deleteLearningActivity,
};

