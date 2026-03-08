const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const config = require('./config/config');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { initNotification } = require('./utils/notification');

// Import routes
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const menuRoutes = require('./routes/menuRoutes');
const tableRoutes = require('./routes/tableRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // For development
    methods: ['GET', 'POST']
  }
});
initNotification(io);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Architecture Protocol: Too many requests. Please cool down.'
  }
});
app.use('/api/', limiter);

// Middleware
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:3002',
  config.FRONTEND_URL,
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Origin not allowed.'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎟️ Welcome to Opus Dining API (Sovereign Concierge Protocol)',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      bookings: '/api/bookings',
      menu: '/api/menu',
      tables: '/api/tables',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();

    server.listen(config.PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 Opus Dining API Server');
      console.log('='.repeat(50));
      console.log(`✅ Server running on: http://localhost:${config.PORT}`);
      console.log(`✅ Environment: ${config.NODE_ENV}`);
      console.log(`✅ Frontend URL: ${config.FRONTEND_URL}`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
