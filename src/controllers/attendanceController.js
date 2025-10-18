const Attendance = require('../models/Attendance');
const Child = require('../models/Child');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { ATTENDANCE_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

// @desc    Get attendance records
// @route   GET /api/v1/attendance
// @access  Private
const getAttendance = asyncHandler(async (req, res) => {
  const { childId, classroomId, date, startDate, endDate } = req.query;

  // Build filter
  const filter = {};
  if (childId) filter.childId = childId;
  if (classroomId) filter.classroomId = classroomId;
  if (date) {
    filter.date = new Date(date);
  } else if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const attendanceRecords = await Attendance.find(filter)
    .populate('childId')
    .populate('classroomId')
    .populate('checkInBy')
    .populate('checkOutBy')
    .sort({ date: -1, checkInTime: -1 });

  res.status(200).json({
    attendanceRecords,
  });
});

// @desc    Get attendance by ID
// @route   GET /api/v1/attendance/:attendanceId
// @access  Private
const getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.attendanceId)
    .populate('childId')
    .populate('classroomId')
    .populate('checkInBy')
    .populate('checkOutBy');

  if (!attendance) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  res.status(200).json(attendance);
});

// @desc    Check in child
// @route   POST /api/v1/attendance/checkin
// @access  Private
const checkInChild = asyncHandler(async (req, res) => {
  const {
    childId,
    classroomId,
    checkInTime,
    checkInNotes,
    temperature,
    mood,
    checkInSignature,
  } = req.body;

  // Validate required fields
  if (!childId || !classroomId) {
    res.status(400);
    throw new Error('Child ID and Classroom ID are required');
  }

  // Check if child exists
  const child = await Child.findById(childId);
  if (!child) {
    res.status(404);
    throw new Error('Child not found');
  }

  // Check if already checked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const existingAttendance = await Attendance.findOne({
    childId,
    date: today,
    status: ATTENDANCE_STATUS.CHECKED_IN,
  });

  if (existingAttendance) {
    res.status(400);
    throw new Error('Child is already checked in today');
  }

  // Create attendance record
  const attendance = await Attendance.create({
    childId,
    classroomId,
    date: today,
    checkInTime: checkInTime || new Date(),
    checkInBy: req.user._id,
    checkInNotes,
    temperature,
    mood,
    checkInSignature,
    status: ATTENDANCE_STATUS.CHECKED_IN,
  });

  // Create notification for parents
  for (const parentId of child.parentIds) {
    await Notification.create({
      userId: parentId,
      type: NOTIFICATION_TYPES.CHECK_IN,
      title: `${child.firstName} checked in`,
      body: `${child.firstName} has been checked in at ${new Date(attendance.checkInTime).toLocaleTimeString()}`,
      data: {
        childId: child._id,
        attendanceId: attendance._id,
      },
    });
  }

  res.status(201).json(attendance);
});

// @desc    Check out child
// @route   POST /api/v1/attendance/checkout
// @access  Private
const checkOutChild = asyncHandler(async (req, res) => {
  const { childId, checkOutTime, checkOutNotes, checkOutSignature } = req.body;

  // Validate required fields
  if (!childId) {
    res.status(400);
    throw new Error('Child ID is required');
  }

  // Find today's attendance record
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({
    childId,
    date: today,
    status: ATTENDANCE_STATUS.CHECKED_IN,
  });

  if (!attendance) {
    res.status(404);
    throw new Error('No check-in record found for today');
  }

  // Update attendance record
  attendance.checkOutTime = checkOutTime || new Date();
  attendance.checkOutBy = req.user._id;
  attendance.checkOutNotes = checkOutNotes;
  attendance.checkOutSignature = checkOutSignature;
  attendance.status = ATTENDANCE_STATUS.CHECKED_OUT;

  await attendance.save();

  // Get child for notification
  const child = await Child.findById(childId);

  // Create notification for parents
  for (const parentId of child.parentIds) {
    await Notification.create({
      userId: parentId,
      type: NOTIFICATION_TYPES.CHECK_OUT,
      title: `${child.firstName} checked out`,
      body: `${child.firstName} has been checked out at ${new Date(attendance.checkOutTime).toLocaleTimeString()}`,
      data: {
        childId: child._id,
        attendanceId: attendance._id,
      },
    });
  }

  res.status(200).json(attendance);
});

// @desc    Mark child as absent
// @route   POST /api/v1/attendance/absent
// @access  Private
const markAbsent = asyncHandler(async (req, res) => {
  const { childId, date, reason } = req.body;

  // Validate required fields
  if (!childId || !date) {
    res.status(400);
    throw new Error('Child ID and date are required');
  }

  // Check if child exists
  const child = await Child.findById(childId);
  if (!child) {
    res.status(404);
    throw new Error('Child not found');
  }

  // Create or update attendance record
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({
    childId,
    date: attendanceDate,
  });

  if (attendance) {
    attendance.status = ATTENDANCE_STATUS.ABSENT;
    attendance.absentReason = reason;
    await attendance.save();
  } else {
    attendance = await Attendance.create({
      childId,
      classroomId: child.classroomId,
      date: attendanceDate,
      status: ATTENDANCE_STATUS.ABSENT,
      absentReason: reason,
    });
  }

  res.status(200).json(attendance);
});

module.exports = {
  getAttendance,
  getAttendanceById,
  checkInChild,
  checkOutChild,
  markAbsent,
};

