const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Mark message as read
// @route   PUT /api/v1/messages/:messageId/read
// @access  Private
const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  // Check if user is the recipient
  if (message.recipientId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  message.isRead = true;
  message.readAt = new Date();
  await message.save();

  res.status(200).json(message);
});

module.exports = {
  markMessageAsRead,
};

