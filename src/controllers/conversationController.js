const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get conversations
// @route   GET /api/v1/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.query.userId || req.user._id;

  // Find conversations where user is a participant
  const conversations = await Conversation.find({
    participantIds: userId,
  })
    .populate('participantIds')
    .populate('childId')
    .populate('classroomId')
    .populate('lastMessageId')
    .sort({ updatedAt: -1 });

  // Get unread count for each conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount = await Message.countDocuments({
        conversationId: conversation._id,
        recipientId: userId,
        isRead: false,
      });

      // Get last message
      const lastMessage = await Message.findOne({
        conversationId: conversation._id,
      })
        .sort({ timestamp: -1 })
        .populate('senderId')
        .populate('recipientId');

      return {
        id: conversation._id,
        participantIds: conversation.participantIds,
        childId: conversation.childId,
        classroomId: conversation.classroomId,
        title: conversation.title,
        lastMessage,
        unreadCount,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      };
    })
  );

  res.status(200).json({
    conversations: conversationsWithUnread,
  });
});

// @desc    Get conversation by ID
// @route   GET /api/v1/conversations/:conversationId
// @access  Private
const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId)
    .populate('participantIds')
    .populate('childId')
    .populate('classroomId');

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  // Check if user is a participant
  const isParticipant = conversation.participantIds.some(
    (participant) => participant._id.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    res.status(403);
    throw new Error('Access denied');
  }

  res.status(200).json(conversation);
});

// @desc    Create conversation
// @route   POST /api/v1/conversations
// @access  Private
const createConversation = asyncHandler(async (req, res) => {
  const { participantIds, childId, classroomId, title } = req.body;

  // Validate required fields
  if (!participantIds || participantIds.length < 2) {
    res.status(400);
    throw new Error('At least 2 participants are required');
  }

  // Check if conversation already exists between these participants
  const existingConversation = await Conversation.findOne({
    participantIds: { $all: participantIds, $size: participantIds.length },
    childId,
  });

  if (existingConversation) {
    return res.status(200).json(existingConversation);
  }

  const conversation = await Conversation.create({
    participantIds,
    childId,
    classroomId,
    title,
  });

  res.status(201).json(conversation);
});

// @desc    Get messages in conversation
// @route   GET /api/v1/conversations/:conversationId/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Check if conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  const isParticipant = conversation.participantIds.some(
    (participant) => participant.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    res.status(403);
    throw new Error('Access denied');
  }

  // Get messages
  const skip = (page - 1) * limit;
  const messages = await Message.find({ conversationId })
    .populate('senderId')
    .populate('recipientId')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Message.countDocuments({ conversationId });
  const pages = Math.ceil(total / limit);

  res.status(200).json({
    messages: messages.reverse(), // Reverse to show oldest first
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages,
    },
  });
});

// @desc    Send message
// @route   POST /api/v1/conversations/:conversationId/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { type, content, attachmentUrls } = req.body;

  // Validate required fields
  if (!content) {
    res.status(400);
    throw new Error('Message content is required');
  }

  // Check if conversation exists and user is participant
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }

  const isParticipant = conversation.participantIds.some(
    (participant) => participant.toString() === req.user._id.toString()
  );

  if (!isParticipant) {
    res.status(403);
    throw new Error('Access denied');
  }

  // Get recipient (the other participant)
  const recipientId = conversation.participantIds.find(
    (participant) => participant.toString() !== req.user._id.toString()
  );

  const message = await Message.create({
    conversationId,
    senderId: req.user._id,
    recipientId,
    type: type || 'text',
    content,
    attachmentUrls,
  });

  // Update conversation's last message
  conversation.lastMessageId = message._id;
  await conversation.save();

  // Create notification for recipient
  const Notification = require('../models/Notification');
  await Notification.create({
    userId: recipientId,
    type: 'message',
    title: `New message from ${req.user.firstName} ${req.user.lastName}`,
    body: content,
    data: {
      conversationId: conversation._id,
      messageId: message._id,
    },
  });

  res.status(201).json(message);
});

// @desc    Mark all messages as read
// @route   PUT /api/v1/conversations/:conversationId/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  // Update all unread messages in conversation for current user
  await Message.updateMany(
    {
      conversationId,
      recipientId: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  res.status(200).json({
    message: 'All messages marked as read',
  });
});

module.exports = {
  getConversations,
  getConversationById,
  createConversation,
  getMessages,
  sendMessage,
  markAllAsRead,
};

