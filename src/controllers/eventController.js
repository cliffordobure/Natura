const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get calendar events
// @route   GET /api/v1/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const { schoolId, classroomId, startDate, endDate } = req.query;

  // Build filter
  const filter = {};
  if (schoolId) filter.schoolId = schoolId;
  if (classroomId) filter.classroomId = classroomId;
  
  if (startDate && endDate) {
    filter.startDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const events = await Event.find(filter)
    .populate('schoolId')
    .populate('classroomId')
    .populate('attendeeIds')
    .populate('createdBy')
    .sort({ startDate: 1 });

  res.status(200).json({
    events,
  });
});

// @desc    Get event by ID
// @route   GET /api/v1/events/:eventId
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId)
    .populate('schoolId')
    .populate('classroomId')
    .populate('attendeeIds')
    .populate('createdBy');

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.status(200).json(event);
});

// @desc    Create event
// @route   POST /api/v1/events
// @access  Private (Teachers and above)
const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    startDate,
    endDate,
    isAllDay,
    location,
    schoolId,
    classroomId,
    attendeeIds,
    color,
  } = req.body;

  // Validate required fields
  if (!title || !type || !startDate || !endDate || !schoolId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const event = await Event.create({
    title,
    description,
    type,
    startDate,
    endDate,
    isAllDay: isAllDay || false,
    location,
    schoolId,
    classroomId,
    attendeeIds,
    createdBy: req.user._id,
    color: color || '#4CAF50',
  });

  res.status(201).json(event);
});

// @desc    Update event
// @route   PUT /api/v1/events/:eventId
// @access  Private (Teachers and above)
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const {
    title,
    description,
    type,
    startDate,
    endDate,
    isAllDay,
    location,
    classroomId,
    attendeeIds,
    color,
  } = req.body;

  // Update fields
  if (title) event.title = title;
  if (description !== undefined) event.description = description;
  if (type) event.type = type;
  if (startDate) event.startDate = startDate;
  if (endDate) event.endDate = endDate;
  if (typeof isAllDay !== 'undefined') event.isAllDay = isAllDay;
  if (location !== undefined) event.location = location;
  if (classroomId !== undefined) event.classroomId = classroomId;
  if (attendeeIds) event.attendeeIds = attendeeIds;
  if (color) event.color = color;

  await event.save();

  res.status(200).json(event);
});

// @desc    Delete event
// @route   DELETE /api/v1/events/:eventId
// @access  Private (Teachers and above)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await event.deleteOne();

  res.status(200).json({
    message: 'Event deleted successfully',
  });
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};

