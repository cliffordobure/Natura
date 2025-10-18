const Activity = require('../models/Activity');
const Child = require('../models/Child');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { getPaginationParams, createPagination, getSortParams } = require('../utils/pagination');
const { NOTIFICATION_TYPES } = require('../config/constants');

// @desc    Get activities
// @route   GET /api/v1/activities
// @access  Private
const getActivities = asyncHandler(async (req, res) => {
  const { childId, classroomId, teacherId, type, startDate, endDate } = req.query;
  const { page, limit, skip } = getPaginationParams(req.query);
  const sort = getSortParams(req.query);

  // Build filter
  const filter = {};
  if (childId) filter.childId = childId;
  if (classroomId) filter.classroomId = classroomId;
  if (teacherId) filter.teacherId = teacherId;
  if (type) filter.type = type;
  
  if (startDate && endDate) {
    filter.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Get activities
  const activities = await Activity.find(filter)
    .populate('childId')
    .populate('classroomId')
    .populate('teacherId')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count
  const total = await Activity.countDocuments(filter);

  res.status(200).json({
    activities,
    pagination: createPagination(page, limit, total),
  });
});

// @desc    Get activity by ID
// @route   GET /api/v1/activities/:activityId
// @access  Private
const getActivityById = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.activityId)
    .populate('childId')
    .populate('classroomId')
    .populate('teacherId');

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  res.status(200).json(activity);
});

// @desc    Create activity
// @route   POST /api/v1/activities
// @access  Private (Teachers and above)
const createActivity = asyncHandler(async (req, res) => {
  const {
    childId,
    classroomId,
    type,
    timestamp,
    title,
    description,
    mediaUrls,
    metadata,
    isSharedWithParents,
  } = req.body;

  // Validate required fields
  if (!childId || !classroomId || !type || !title) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if child exists
  const child = await Child.findById(childId);
  if (!child) {
    res.status(404);
    throw new Error('Child not found');
  }

  const activity = await Activity.create({
    childId,
    classroomId,
    teacherId: req.user._id,
    type,
    timestamp: timestamp || new Date(),
    title,
    description,
    mediaUrls,
    metadata,
    isSharedWithParents: isSharedWithParents !== false,
  });

  // Create notification for parents if shared
  if (isSharedWithParents !== false) {
    for (const parentId of child.parentIds) {
      await Notification.create({
        userId: parentId,
        type: NOTIFICATION_TYPES.ACTIVITY,
        title: `New ${type} activity for ${child.firstName}`,
        body: title,
        imageUrl: mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : null,
        data: {
          childId: child._id,
          activityId: activity._id,
        },
      });
    }
  }

  res.status(201).json(activity);
});

// @desc    Update activity
// @route   PUT /api/v1/activities/:activityId
// @access  Private (Teachers and above)
const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.activityId);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  const {
    type,
    timestamp,
    title,
    description,
    mediaUrls,
    metadata,
    isSharedWithParents,
  } = req.body;

  // Update fields
  if (type) activity.type = type;
  if (timestamp) activity.timestamp = timestamp;
  if (title) activity.title = title;
  if (description !== undefined) activity.description = description;
  if (mediaUrls) activity.mediaUrls = mediaUrls;
  if (metadata) activity.metadata = metadata;
  if (typeof isSharedWithParents !== 'undefined') activity.isSharedWithParents = isSharedWithParents;

  await activity.save();

  res.status(200).json(activity);
});

// @desc    Delete activity
// @route   DELETE /api/v1/activities/:activityId
// @access  Private (Teachers and above)
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.activityId);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  await activity.deleteOne();

  res.status(200).json({
    message: 'Activity deleted successfully',
  });
});

// @desc    Upload media (placeholder - will be implemented with multer)
// @route   POST /api/v1/activities/media
// @access  Private
const uploadMedia = asyncHandler(async (req, res) => {
  // This will be implemented with multer middleware
  res.status(200).json({
    url: 'https://cdn.natura.com/media/placeholder.jpg',
  });
});

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  uploadMedia,
};

