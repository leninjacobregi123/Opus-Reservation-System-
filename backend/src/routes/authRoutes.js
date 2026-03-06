const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
