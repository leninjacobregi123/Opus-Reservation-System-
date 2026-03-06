const express = require('express');
const router = express.Router();
const { createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { ROLES } = require('../config/constants');

// Protected routes (Restaurant Owner or Admin)
router.use(authenticate);
router.use(authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN));

router.post('/', validate(schemas.createTable), createTable);
router.put('/:id', updateTable);
router.delete('/:id', deleteTable);

module.exports = router;
