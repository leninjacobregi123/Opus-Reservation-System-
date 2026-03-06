const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const config = require('../config/config');
const { ROLES } = require('../config/constants');

// Register new user
const register = (req, res) => {
  const { email, password, full_name, phone, role } = req.body;

  // Check if user already exists
  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }

    if (user) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    try {
      // Hash password safely inside try-catch
      const password_hash = await bcrypt.hash(password, 10);
      const userRole = role || ROLES.CUSTOMER;
      const sql = `INSERT INTO users (email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?)`;

      db.run(sql, [email, password_hash, full_name, phone, userRole], function (err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Failed to create user', error: err.message });
        }

        try {
          // Generate JWT token safely
          const token = jwt.sign(
            { id: this.lastID, email, role: userRole },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
          );

          res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: { id: this.lastID, email, full_name, phone, role: userRole }, token },
          });
        } catch (tokenErr) {
          return res.status(500).json({ success: false, message: 'Token generation failed', error: tokenErr.message });
        }
      });
    } catch (hashErr) {
      return res.status(500).json({ success: false, message: 'Encryption failure', error: hashErr.message });
    }
  });
};

// Login user
const login = (req, res) => {
  const { email, password } = req.body;

  // Find user
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    try {
      // Verify password safely
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Generate JWT token safely
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      delete user.password_hash;
      res.json({ success: true, message: 'Login successful', data: { user, token } });
      
    } catch (compareErr) {
      return res.status(500).json({ success: false, message: 'Authentication verification failed', error: compareErr.message });
    }
  });
};

// Get current user profile
const getProfile = (req, res) => {
  const userId = req.user.id;

  db.get(
    'SELECT id, email, full_name, phone, role, profile_image, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message,
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    }
  );
};

// Update user profile
const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { full_name, phone } = req.body;

  const sql = 'UPDATE users SET full_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

  db.run(sql, [full_name, phone, userId], function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
