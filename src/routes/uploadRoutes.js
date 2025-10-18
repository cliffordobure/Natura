const express = require('express');
const router = express.Router();
const {
  uploadMediaFile,
  uploadDocumentFile,
  uploadAvatarFile,
  uploadMultipleFiles,
} = require('../controllers/uploadController');
const { uploadMedia, uploadDocument, uploadAvatar } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/media', protect, uploadMedia.single('file'), uploadMediaFile);
router.post('/documents', protect, uploadDocument.single('file'), uploadDocumentFile);
router.post('/avatar', protect, uploadAvatar.single('file'), uploadAvatarFile);
router.post('/multiple', protect, uploadMedia.array('files', 10), uploadMultipleFiles);

module.exports = router;

