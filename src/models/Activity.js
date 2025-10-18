const mongoose = require('mongoose');
const { ACTIVITY_TYPES } = require('../config/constants');

const activitySchema = new mongoose.Schema(
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
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher ID is required'],
    },
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
      required: [true, 'Activity type is required'],
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    mediaUrls: [{
      type: String,
    }],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    isSharedWithParents: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
activitySchema.index({ childId: 1, timestamp: -1 });
activitySchema.index({ classroomId: 1, timestamp: -1 });
activitySchema.index({ type: 1, timestamp: -1 });

module.exports = mongoose.model('Activity', activitySchema);

