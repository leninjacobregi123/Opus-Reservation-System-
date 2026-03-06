const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
} = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// All booking routes require authentication
router.use(authenticate);

router.post('/', validate(schemas.createBooking), createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/check-availability', checkAvailability);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', cancelBooking);

module.exports = router;
