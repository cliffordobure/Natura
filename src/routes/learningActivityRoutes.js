const express = require('express');
const router = express.Router();
const {
  getLearningActivities,
  getLearningActivityById,
  createLearningActivity,
  updateLearningActivity,
  deleteLearningActivity,
} = require('../controllers/learningActivityController');
const { protect, isTeacherOrAbove } = require('../middleware/authMiddleware');

router.get('/', protect, getLearningActivities);
router.post('/', protect, isTeacherOrAbove, createLearningActivity);
router.get('/:activityId', protect, getLearningActivityById);
router.put('/:activityId', protect, isTeacherOrAbove, updateLearningActivity);
router.delete('/:activityId', protect, isTeacherOrAbove, deleteLearningActivity);

module.exports = router;

