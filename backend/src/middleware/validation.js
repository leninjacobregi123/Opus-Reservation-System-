const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Create restaurant
  createRestaurant: Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().optional(),
    cuisine_type: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
    price_range: Joi.string().valid('$', '$$', '$$$', '$$$$').required(),
    opening_time: Joi.string().required(),
    closing_time: Joi.string().required(),
  }),

  // Create booking
  createBooking: Joi.object({
    restaurant_id: Joi.number().integer().required(),
    table_id: Joi.number().integer().required(),
    booking_date: Joi.date().iso().required(),
    booking_time: Joi.string().required(),
    guest_count: Joi.number().integer().min(1).required(),
    duration: Joi.number().integer().min(30).max(300).optional(),
    is_surprise: Joi.boolean().optional(),
    special_occasion: Joi.string().optional(),
    notes: Joi.string().max(500).optional(),
  }),

  // Add menu item
  createMenuItem: Joi.object({
    restaurant_id: Joi.number().integer().required(),
    name: Joi.string().min(2).required(),
    description: Joi.string().optional(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    is_vegetarian: Joi.boolean().optional(),
    preparation_time: Joi.number().integer().optional(),
  }),

  // Create table
  createTable: Joi.object({
    restaurant_id: Joi.number().integer().required(),
    table_number: Joi.string().required(),
    capacity: Joi.number().integer().min(1).required(),
    location_type: Joi.string().optional(),
    position_x: Joi.number().optional(),
    position_y: Joi.number().optional(),
  }),
};

module.exports = { validate, schemas };
