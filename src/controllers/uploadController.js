const asyncHandler = require('../utils/asyncHandler');
const path = require('path');

// @desc    Upload media file (image/video)
// @route   POST /api/v1/upload/media
// @access  Private
const uploadMediaFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const fileUrl = `${process.env.BASE_URL}/uploads/media/${req.file.filename}`;

  res.status(200).json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// @desc    Upload document
// @route   POST /api/v1/upload/documents
// @access  Private
const uploadDocumentFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const fileUrl = `${process.env.BASE_URL}/uploads/documents/${req.file.filename}`;

  res.status(200).json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// @desc    Upload avatar/profile image
// @route   POST /api/v1/upload/avatar
// @access  Private
const uploadAvatarFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const fileUrl = `${process.env.BASE_URL}/uploads/avatars/${req.file.filename}`;

  res.status(200).json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// @desc    Upload multiple files
// @route   POST /api/v1/upload/multiple
// @access  Private
const uploadMultipleFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const fileUrls = req.files.map((file) => ({
    url: `${process.env.BASE_URL}/uploads/media/${file.filename}`,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
  }));

  res.status(200).json({
    files: fileUrls,
  });
});

module.exports = {
  uploadMediaFile,
  uploadDocumentFile,
  uploadAvatarFile,
  uploadMultipleFiles,
};

