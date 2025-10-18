const express = require('express');
const router = express.Router();
const {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} = require('../controllers/schoolController');
const { protect, isAdminOrDirector } = require('../middleware/authMiddleware');

router.get('/', protect, getSchools);
router.post('/', protect, isAdminOrDirector, createSchool);
router.get('/:schoolId', protect, getSchoolById);
router.put('/:schoolId', protect, isAdminOrDirector, updateSchool);
router.delete('/:schoolId', protect, isAdminOrDirector, deleteSchool);

module.exports = router;

