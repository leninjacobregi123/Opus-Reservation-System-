const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../config/database');

const createPaymentIntent = async (req, res) => {
  const { amount, booking_id } = req.body;
  const userId = req.user.id;

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_id: booking_id.toString(),
        user_id: userId.toString(),
      },
    });

    // Save initial payment record in DB
    db.run(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, payment_status, transaction_id, payment_gateway)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [booking_id, userId, amount, 'card', 'pending', paymentIntent.id, 'stripe']
    );

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Stripe Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment gateway.',
      error: err.message,
    });
  }
};

const confirmPayment = async (req, res) => {
  const { payment_intent_id, booking_id } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === 'succeeded') {
      // Update payment status in DB
      db.run(
        `UPDATE payments SET payment_status = 'succeeded', paid_at = CURRENT_TIMESTAMP WHERE transaction_id = ?`,
        [payment_intent_id]
      );

      // Update booking status
      db.run(
        `UPDATE bookings SET status = 'confirmed' WHERE id = ?`,
        [booking_id]
      );

      res.json({
        success: true,
        message: 'Settlement Authenticated.',
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Settlement Unverified: ${paymentIntent.status}`,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify settlement.',
      error: err.message,
    });
  }
};

module.exports = { createPaymentIntent, confirmPayment };
