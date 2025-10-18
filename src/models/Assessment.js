const mongoose = require('mongoose');
const { DEVELOPMENT_DOMAINS, ASSESSMENT_LEVELS } = require('../config/constants');

const assessmentSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: [true, 'Child ID is required'],
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher ID is required'],
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom ID is required'],
    },
    assessmentDate: {
      type: Date,
      required: [true, 'Assessment date is required'],
      default: Date.now,
    },
    skillName: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    domain: {
      type: String,
      enum: Object.values(DEVELOPMENT_DOMAINS),
      required: [true, 'Domain is required'],
    },
    level: {
      type: String,
      enum: Object.values(ASSESSMENT_LEVELS),
      required: [true, 'Level is required'],
    },
    notes: {
      type: String,
    },
    mediaUrls: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Create indexes
assessmentSchema.index({ childId: 1, assessmentDate: -1 });
assessmentSchema.index({ domain: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);

