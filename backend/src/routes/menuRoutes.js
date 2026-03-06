const express = require('express');
const router = express.Router();
const { createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { ROLES } = require('../config/constants');

// Protected routes (Restaurant Owner or Admin)
router.use(authenticate);
router.use(authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN));

router.post('/', validate(schemas.createMenuItem), createMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;
