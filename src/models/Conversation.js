const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participantIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
    },
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
    },
    title: {
      type: String,
      trim: true,
    },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for participants
conversationSchema.index({ participantIds: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);

