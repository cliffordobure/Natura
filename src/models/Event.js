const mongoose = require('mongoose');
const { EVENT_TYPES } = require('../config/constants');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: Object.values(EVENT_TYPES),
      required: [true, 'Event type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
    },
    attendeeIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    color: {
      type: String,
      default: '#4CAF50',
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
eventSchema.index({ schoolId: 1, startDate: 1 });
eventSchema.index({ classroomId: 1, startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);

