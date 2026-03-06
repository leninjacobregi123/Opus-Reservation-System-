const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'restaurants'; // default

    if (req.path.includes('menu')) {
      folder = 'menus';
    } else if (req.path.includes('floor-plan')) {
      folder = 'floor-plans';
    }

    cb(null, path.join(config.UPLOAD_PATH, folder));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (config.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
  },
});

module.exports = upload;
