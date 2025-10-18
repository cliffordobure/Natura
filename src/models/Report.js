const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
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
    reportDate: {
      type: Date,
      required: [true, 'Report date is required'],
      default: Date.now,
    },
    reportPeriod: {
      type: String,
      required: [true, 'Report period is required'],
    },
    domainSummaries: {
      cognitive: String,
      physical: String,
      socialEmotional: String,
      language: String,
      creative: String,
    },
    assessments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
    }],
    overallNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create index
reportSchema.index({ childId: 1, reportDate: -1 });

module.exports = mongoose.model('Report', reportSchema);

