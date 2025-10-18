const express = require('express');
const router = express.Router();
const { markMessageAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:messageId/read', protect, markMessageAsRead);

module.exports = router;

