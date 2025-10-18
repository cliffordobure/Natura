const express = require('express');
const router = express.Router();
const {
  getAttendance,
  getAttendanceById,
  checkInChild,
  checkOutChild,
  markAbsent,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAttendance);
router.get('/:attendanceId', protect, getAttendanceById);
router.post('/checkin', protect, checkInChild);
router.post('/checkout', protect, checkOutChild);
router.post('/absent', protect, markAbsent);

module.exports = router;

