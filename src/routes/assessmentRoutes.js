const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require('../controllers/assessmentController');
const { protect, isTeacherOrAbove } = require('../middleware/authMiddleware');

router.get('/', protect, getAssessments);
router.post('/', protect, isTeacherOrAbove, createAssessment);
router.get('/:assessmentId', protect, getAssessmentById);
router.put('/:assessmentId', protect, isTeacherOrAbove, updateAssessment);
router.delete('/:assessmentId', protect, isTeacherOrAbove, deleteAssessment);

module.exports = router;

