const Assessment = require('../models/Assessment');
const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get assessments
// @route   GET /api/v1/assessments
// @access  Private
const getAssessments = asyncHandler(async (req, res) => {
  const { childId, domain } = req.query;

  // Build filter
  const filter = {};
  if (childId) filter.childId = childId;
  if (domain) filter.domain = domain;

  const assessments = await Assessment.find(filter)
    .populate('childId')
    .populate('teacherId')
    .populate('classroomId')
    .sort({ assessmentDate: -1 });

  res.status(200).json({
    assessments,
  });
});

// @desc    Get assessment by ID
// @route   GET /api/v1/assessments/:assessmentId
// @access  Private
const getAssessmentById = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId)
    .populate('childId')
    .populate('teacherId')
    .populate('classroomId');

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  res.status(200).json(assessment);
});

// @desc    Create assessment
// @route   POST /api/v1/assessments
// @access  Private (Teachers and above)
const createAssessment = asyncHandler(async (req, res) => {
  const {
    childId,
    classroomId,
    assessmentDate,
    skillName,
    domain,
    level,
    notes,
    mediaUrls,
  } = req.body;

  // Validate required fields
  if (!childId || !classroomId || !skillName || !domain || !level) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const assessment = await Assessment.create({
    childId,
    teacherId: req.user._id,
    classroomId,
    assessmentDate: assessmentDate || new Date(),
    skillName,
    domain,
    level,
    notes,
    mediaUrls,
  });

  res.status(201).json(assessment);
});

// @desc    Update assessment
// @route   PUT /api/v1/assessments/:assessmentId
// @access  Private (Teachers and above)
const updateAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  const {
    assessmentDate,
    skillName,
    domain,
    level,
    notes,
    mediaUrls,
  } = req.body;

  // Update fields
  if (assessmentDate) assessment.assessmentDate = assessmentDate;
  if (skillName) assessment.skillName = skillName;
  if (domain) assessment.domain = domain;
  if (level) assessment.level = level;
  if (notes !== undefined) assessment.notes = notes;
  if (mediaUrls) assessment.mediaUrls = mediaUrls;

  await assessment.save();

  res.status(200).json(assessment);
});

// @desc    Delete assessment
// @route   DELETE /api/v1/assessments/:assessmentId
// @access  Private (Teachers and above)
const deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  await assessment.deleteOne();

  res.status(200).json({
    message: 'Assessment deleted successfully',
  });
});

// @desc    Get development reports
// @route   GET /api/v1/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const { childId } = req.query;

  // Build filter
  const filter = {};
  if (childId) filter.childId = childId;

  const reports = await Report.find(filter)
    .populate('childId')
    .populate('teacherId')
    .populate('assessments')
    .sort({ reportDate: -1 });

  res.status(200).json({
    reports,
  });
});

// @desc    Create development report
// @route   POST /api/v1/reports
// @access  Private (Teachers and above)
const createReport = asyncHandler(async (req, res) => {
  const {
    childId,
    reportPeriod,
    domainSummaries,
    assessments,
    overallNotes,
  } = req.body;

  // Validate required fields
  if (!childId || !reportPeriod) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const report = await Report.create({
    childId,
    teacherId: req.user._id,
    reportDate: new Date(),
    reportPeriod,
    domainSummaries,
    assessments,
    overallNotes,
  });

  res.status(201).json(report);
});

module.exports = {
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getReports,
  createReport,
};

