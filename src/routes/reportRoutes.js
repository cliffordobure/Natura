const express = require('express');
const router = express.Router();
const {
  getReports,
  createReport,
} = require('../controllers/assessmentController');
const { protect, isTeacherOrAbove } = require('../middleware/authMiddleware');

// Reports for development assessments
router.get('/', protect, getReports);
router.post('/', protect, isTeacherOrAbove, createReport);

// Analytics reports will be handled by reportController
const {
  getAttendanceReport,
  getFinancialReport,
  getEnrollmentReport,
  getActivitySummaryReport,
} = require('../controllers/reportController');

router.get('/attendance', protect, isTeacherOrAbove, getAttendanceReport);
router.get('/financial', protect, isTeacherOrAbove, getFinancialReport);
router.get('/enrollment', protect, isTeacherOrAbove, getEnrollmentReport);
router.get('/activities', protect, getActivitySummaryReport);

module.exports = router;

