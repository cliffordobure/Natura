const mongoose = require('mongoose');
const { AGE_GROUPS } = require('../config/constants');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Classroom name is required'],
      trim: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    teacherIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    childrenIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
    }],
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    ageGroup: {
      type: String,
      enum: AGE_GROUPS,
      required: [true, 'Age group is required'],
    },
    roomImageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Classroom', classroomSchema);

