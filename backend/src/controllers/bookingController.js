const { db } = require('../config/database');
const { BOOKING_STATUS } = require('../config/constants');
const { sendNotification } = require('../utils/notification');

// Create new booking
const createBooking = (req, res) => {
  const userId = req.user.id;
  const {
    restaurant_id,
    table_id,
    booking_date,
    booking_time,
    guest_count,
    duration,
    is_surprise,
    special_occasion,
    notes,
  } = req.body;

  const bookingDuration = duration || 120;

  // STEP 1: Logical check before attempt (Good UX)
  const checkSql = `SELECT id FROM bookings WHERE table_id = ? AND booking_date = ? AND booking_time = ? AND status != 'cancelled'`;
  db.get(checkSql, [table_id, booking_date, booking_time], (err, existing) => {
    if (existing) {
      return res.status(400).json({ success: false, message: 'Architecture Alert: This asset slot is already secured.' });
    }

    // STEP 2: Physical Hard Constraint attempt
    const insertBookingSql = `
      INSERT INTO bookings (
        user_id, restaurant_id, table_id, booking_date, booking_time,
        duration, guest_count, is_surprise, special_occasion, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const bookingParams = [userId, restaurant_id, table_id, booking_date, booking_time, bookingDuration, guest_count, is_surprise ? 1 : 0, special_occasion, notes];

    db.run(insertBookingSql, bookingParams, function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ success: false, message: 'Protocol Collision: This asset was just secured by another user.' });
        }
        return res.status(500).json({ success: false, message: 'Failed to create booking', error: err.message });
      }

      const bookingId = this.lastID;

      // Trigger Real-time Notification
      sendNotification(
        userId, 
        'Booking Protocol Initiated', 
        `Your reservation for ${booking_date} at ${booking_time} has been recorded in the ledger.`,
        'success',
        { booking_id: bookingId }
      );

      res.status(201).json({
        success: true,
        message: 'Booking created successfully!',
        data: { booking_id: bookingId, status: BOOKING_STATUS.PENDING }
      });
    });
  });
};

// Get booking by ID
const getBookingById = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `
    SELECT
      b.*,
      r.name as restaurant_name,
      r.address as restaurant_address,
      r.phone as restaurant_phone,
      t.table_number,
      t.location_type,
      u.full_name as user_name,
      u.email as user_email,
      u.phone as user_phone
    FROM bookings b
    JOIN restaurants r ON b.restaurant_id = r.id
    JOIN tables t ON b.table_id = t.id
    JOIN users u ON b.user_id = u.id
    WHERE b.id = ?
  `;

  db.get(sql, [id], (err, booking) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user has permission to view
    if (booking.user_id !== userId && req.user.role !== 'admin' && req.user.role !== 'restaurant_owner') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this booking',
      });
    }

    // Get pre-orders
    db.all(
      `
      SELECT po.*, mi.name, mi.price, mi.image
      FROM pre_orders po
      JOIN menu_items mi ON po.menu_item_id = mi.id
      WHERE po.booking_id = ?
    `,
      [id],
      (err, preOrders) => {
        if (err) {
          preOrders = [];
        }

        // Get special requests
        db.all('SELECT * FROM special_requests WHERE booking_id = ?', [id], (err, specialRequests) => {
          if (err) {
            specialRequests = [];
          }

          res.json({
            success: true,
            data: {
              ...booking,
              pre_orders: preOrders,
              special_requests: specialRequests.map((sr) => ({
                ...sr,
                details: sr.details ? JSON.parse(sr.details) : null,
              })),
            },
          });
        });
      }
    );
  });
};

// Get user's bookings
const getUserBookings = (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  let sql = `
    SELECT
      b.*,
      r.name as restaurant_name,
      r.images as restaurant_images,
      r.address as restaurant_address,
      r.city,
      t.table_number,
      t.location_type
    FROM bookings b
    JOIN restaurants r ON b.restaurant_id = r.id
    JOIN tables t ON b.table_id = t.id
    WHERE b.user_id = ?
  `;

  const params = [userId];

  if (status) {
    sql += ' AND b.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY b.booking_date DESC, b.booking_time DESC';

  db.all(sql, params, (err, bookings) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: err.message,
      });
    }

    const formattedBookings = bookings.map((b) => ({
      ...b,
      restaurant_images: b.restaurant_images ? JSON.parse(b.restaurant_images) : [],
    }));

    res.json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    });
  });
};

// Update booking status
const updateBookingStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  if (!Object.values(BOOKING_STATUS).includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status',
    });
  }

  // Get booking details for notification
  db.get('SELECT user_id, booking_date, booking_time FROM bookings WHERE id = ?', [id], (err, booking) => {
    if (booking) {
      db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: err.message,
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            success: false,
            message: 'Booking not found',
          });
        }

        // Trigger Real-time Notification for status change
        sendNotification(
          booking.user_id, 
          `Manifest Decree: ${status.toUpperCase()}`, 
          `Your reservation for ${booking.booking_date} has been updated to ${status}.`,
          status === 'confirmed' ? 'success' : 'info',
          { booking_id: id, status }
        );

        res.json({
          success: true,
          message: 'Booking status updated successfully',
        });
      });
    } else {
      res.status(404).json({ success: false, message: 'Booking not found' });
    }
  });
};

// Cancel booking
const cancelBooking = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if booking belongs to user
  db.get('SELECT user_id, status, booking_date FROM bookings WHERE id = ?', [id], (err, booking) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this booking',
      });
    }

    if (booking.status === BOOKING_STATUS.COMPLETED || booking.status === BOOKING_STATUS.CANCELLED) {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled',
      });
    }

    db.run('UPDATE bookings SET status = ? WHERE id = ?', [BOOKING_STATUS.CANCELLED, id], function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to cancel booking',
          error: err.message,
        });
      }

      // Trigger Real-time Notification
      sendNotification(
        userId, 
        'Manifest Voided', 
        `Your reservation for ${booking.booking_date} has been successfully cancelled.`,
        'error',
        { booking_id: id }
      );

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
      });
    });
  });
};

// Check table availability
const checkAvailability = (req, res) => {
  const { table_id, booking_date, booking_time, duration } = req.query;

  if (!table_id || !booking_date || !booking_time) {
    return res.status(400).json({
      success: false,
      message: 'table_id, booking_date, and booking_time are required',
    });
  }

  const bookingDuration = duration || 120;

  const sql = `
    SELECT COUNT(*) as count FROM bookings
    WHERE table_id = ?
      AND booking_date = ?
      AND status NOT IN ('cancelled', 'completed')
      AND (
        (booking_time <= ? AND datetime(booking_time, '+' || duration || ' minutes') > ?)
        OR (booking_time >= ? AND booking_time < datetime(?, '+' || ? || ' minutes'))
      )
  `;

  const params = [table_id, booking_date, booking_time, booking_time, booking_time, booking_time, bookingDuration];

  db.get(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error checking availability',
        error: err.message,
      });
    }

    res.json({
      success: true,
      available: result.count === 0,
      message: result.count === 0 ? 'Table is available' : 'Table is not available at this time',
    });
  });
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  checkAvailability,
};
