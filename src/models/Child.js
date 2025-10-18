const mongoose = require('mongoose');
const { GENDER } = require('../config/constants');

const childSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
      required: [true, 'Gender is required'],
    },
    profileImageUrl: {
      type: String,
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom ID is required'],
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School ID is required'],
    },
    parentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    authorizedPickupIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    allergies: {
      type: String,
    },
    medicalNotes: {
      type: String,
    },
    emergencyContact: {
      type: String,
      required: [true, 'Emergency contact is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Child', childSchema);

