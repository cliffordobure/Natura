const express = require('express');
const router = express.Router();
const {
  getConversations,
  getConversationById,
  createConversation,
  getMessages,
  sendMessage,
  markAllAsRead,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getConversations);
router.post('/', protect, createConversation);
router.get('/:conversationId', protect, getConversationById);
router.get('/:conversationId/messages', protect, getMessages);
router.post('/:conversationId/messages', protect, sendMessage);
router.put('/:conversationId/read-all', protect, markAllAsRead);

module.exports = router;

