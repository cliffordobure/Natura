const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get notifications
// @route   GET /api/v1/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { userId, isRead } = req.query;

  // Build filter
  const filter = {};
  filter.userId = userId || req.user._id;
  if (typeof isRead !== 'undefined') {
    filter.isRead = isRead === 'true';
  }

  const notifications = await Notification.find(filter)
    .sort({ timestamp: -1 })
    .limit(100);

  res.status(200).json({
    notifications,
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:notificationId/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Check if user owns this notification
  if (notification.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  res.status(200).json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.status(200).json({
    message: 'All notifications marked as read',
  });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:notificationId
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.notificationId);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Check if user owns this notification
  if (notification.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Access denied');
  }

  await notification.deleteOne();

  res.status(200).json({
    message: 'Notification deleted successfully',
  });
});

// @desc    Send push notification
// @route   POST /api/v1/notifications/push
// @access  Private (Teachers and above)
const sendPushNotification = asyncHandler(async (req, res) => {
  const { userIds, type, title, body, data } = req.body;

  // Validate required fields
  if (!userIds || !type || !title || !body) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create notifications for all users
  const notifications = await Promise.all(
    userIds.map((userId) =>
      Notification.create({
        userId,
        type,
        title,
        body,
        data,
      })
    )
  );

  res.status(201).json({
    message: `Notifications sent to ${userIds.length} users`,
    notifications,
  });
});

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  sendPushNotification,
};

