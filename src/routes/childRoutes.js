const express = require('express');
const router = express.Router();
const {
  getChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild,
} = require('../controllers/childController');
const { protect, isAdminOrDirector } = require('../middleware/authMiddleware');

router.get('/', protect, getChildren);
router.post('/', protect, createChild);
router.get('/:childId', protect, getChildById);
router.put('/:childId', protect, updateChild);
router.delete('/:childId', protect, isAdminOrDirector, deleteChild);

module.exports = router;

