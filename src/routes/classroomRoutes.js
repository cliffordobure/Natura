const express = require('express');
const router = express.Router();
const {
  getClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
} = require('../controllers/classroomController');
const { protect, isAdminOrDirector } = require('../middleware/authMiddleware');

router.get('/', protect, getClassrooms);
router.post('/', protect, isAdminOrDirector, createClassroom);
router.get('/:classroomId', protect, getClassroomById);
router.put('/:classroomId', protect, isAdminOrDirector, updateClassroom);
router.delete('/:classroomId', protect, isAdminOrDirector, deleteClassroom);

module.exports = router;

