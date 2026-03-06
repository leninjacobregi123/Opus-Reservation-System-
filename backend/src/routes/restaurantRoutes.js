const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantTables,
  getRestaurantMenu,
  getRestaurantReviews,
} = require('../controllers/restaurantController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { ROLES } = require('../config/constants');

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/tables', getRestaurantTables);
router.get('/:id/menu', getRestaurantMenu);
router.get('/:id/reviews', getRestaurantReviews);

// Protected routes (Restaurant Owner or Admin)
router.post(
  '/',
  authenticate,
  authorize(ROLES.RESTAURANT_OWNER, ROLES.ADMIN),
  validate(schemas.createRestaurant),
  createRestaurant
);
router.put('/:id', authenticate, updateRestaurant);
router.delete('/:id', authenticate, deleteRestaurant);

module.exports = router;
