const express = require('express');
const router = express.Router();
const {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  uploadMedia,
} = require('../controllers/activityController');
const { protect, isTeacherOrAbove } = require('../middleware/authMiddleware');

router.get('/', protect, getActivities);
router.post('/', protect, isTeacherOrAbove, createActivity);
router.post('/media', protect, isTeacherOrAbove, uploadMedia);
router.get('/:activityId', protect, getActivityById);
router.put('/:activityId', protect, isTeacherOrAbove, updateActivity);
router.delete('/:activityId', protect, isTeacherOrAbove, deleteActivity);

module.exports = router;

