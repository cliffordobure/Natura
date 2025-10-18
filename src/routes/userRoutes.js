const express = require('express');
const router = express.Router();
const {
  getMe,
  updateMe,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, isAdminOrDirector } = require('../middleware/authMiddleware');

// Current user routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// Admin routes
router.get('/', protect, isAdminOrDirector, getUsers);
router.post('/', protect, isAdminOrDirector, createUser);
router.get('/:userId', protect, getUserById);
router.put('/:userId', protect, isAdminOrDirector, updateUser);
router.delete('/:userId', protect, isAdminOrDirector, deleteUser);

module.exports = router;

