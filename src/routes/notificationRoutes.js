const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  sendPushNotification,
} = require('../controllers/notificationController');
const { protect, isTeacherOrAbove } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllAsRead);
router.post('/push', protect, isTeacherOrAbove, sendPushNotification);
router.put('/:notificationId/read', protect, markNotificationAsRead);
router.delete('/:notificationId', protect, deleteNotification);

module.exports = router;

