const mongoose = require('mongoose');
const { DEVELOPMENT_DOMAINS, AGE_GROUPS } = require('../config/constants');

const learningActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    domain: {
      type: String,
      enum: Object.values(DEVELOPMENT_DOMAINS),
      required: [true, 'Domain is required'],
    },
    ageGroup: {
      type: String,
      enum: AGE_GROUPS,
      required: [true, 'Age group is required'],
    },
    objectives: [{
      type: String,
    }],
    instructions: {
      type: String,
    },
    materialNeeded: [{
      type: String,
    }],
    durationMinutes: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
learningActivitySchema.index({ domain: 1, ageGroup: 1 });

module.exports = mongoose.model('LearningActivity', learningActivitySchema);

