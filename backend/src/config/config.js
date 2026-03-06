require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

  // Allowed file types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};
