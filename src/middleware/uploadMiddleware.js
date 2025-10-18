const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const mediaDir = path.join(uploadDir, 'media');
const documentsDir = path.join(uploadDir, 'documents');
const avatarsDir = path.join(uploadDir, 'avatars');

[uploadDir, mediaDir, documentsDir, avatarsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = mediaDir;
    
    if (req.path.includes('/documents')) {
      folder = documentsDir;
    } else if (req.path.includes('/avatar')) {
      folder = avatarsDir;
    }
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images and videos
const mediaFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed (jpeg, jpg, png, gif, mp4, mov, webp)'));
  }
};

// File filter for documents
const documentFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only documents are allowed (pdf, doc, docx, xls, xlsx)'));
  }
};

// File filter for profile images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png)'));
  }
};

// Create multer upload instances
const uploadMedia = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 }, // 50MB
  fileFilter: mediaFileFilter,
});

const uploadDocument = multer({
  storage: storage,
  limits: { fileSize: 10485760 }, // 10MB
  fileFilter: documentFileFilter,
});

const uploadAvatar = multer({
  storage: storage,
  limits: { fileSize: 5242880 }, // 5MB
  fileFilter: imageFileFilter,
});

module.exports = {
  uploadMedia,
  uploadDocument,
  uploadAvatar,
};

