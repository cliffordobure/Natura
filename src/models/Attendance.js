const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../config/constants');

const attendanceSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: [true, 'Child ID is required'],
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    checkInTime: {
      type: Date,
    },
    checkInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    checkInNotes: {
      type: String,
    },
    checkInSignature: {
      type: String,
    },
    checkOutTime: {
      type: Date,
    },
    checkOutBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    checkOutNotes: {
      type: String,
    },
    checkOutSignature: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      required: [true, 'Status is required'],
      default: ATTENDANCE_STATUS.SCHEDULED,
    },
    temperature: {
      type: Number,
    },
    mood: {
      type: String,
    },
    absentReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for child and date
attendanceSchema.index({ childId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

