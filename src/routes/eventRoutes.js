const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, isTeacherOrAbove } = require('../middleware/authMiddleware');

router.get('/', protect, getEvents);
router.post('/', protect, isTeacherOrAbove, createEvent);
router.get('/:eventId', protect, getEventById);
router.put('/:eventId', protect, isTeacherOrAbove, updateEvent);
router.delete('/:eventId', protect, isTeacherOrAbove, deleteEvent);

module.exports = router;

