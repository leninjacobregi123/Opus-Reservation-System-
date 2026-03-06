const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database/bookmyseat.db';
const dbFullPath = path.resolve(dbPath);

// Create database connection
const db = new sqlite3.Database(dbFullPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database at:', dbFullPath);

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  }
});

// Initialize database schema
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          full_name TEXT NOT NULL,
          phone TEXT,
          role TEXT DEFAULT 'customer',
          profile_image TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Restaurants table
      db.run(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          owner_id INTEGER,
          name TEXT NOT NULL,
          description TEXT,
          cuisine_type TEXT,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          latitude REAL,
          longitude REAL,
          phone TEXT,
          email TEXT,
          rating REAL DEFAULT 0,
          price_range TEXT,
          opening_time TEXT,
          closing_time TEXT,
          images TEXT,
          floor_plan TEXT,
          google_place_id TEXT,
          is_verified INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users(id)
        )
      `);

      // Tables (physical tables in restaurant)
      db.run(`
        CREATE TABLE IF NOT EXISTS tables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL,
          table_number TEXT NOT NULL,
          capacity INTEGER NOT NULL,
          location_type TEXT,
          position_x REAL,
          position_y REAL,
          is_available INTEGER DEFAULT 1,
          special_features TEXT,
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
        )
      `);

      // Menu items
      db.run(`
        CREATE TABLE IF NOT EXISTS menu_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT,
          price REAL NOT NULL,
          image TEXT,
          is_vegetarian INTEGER DEFAULT 0,
          is_available INTEGER DEFAULT 1,
          preparation_time INTEGER,
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
        )
      `);

      // Bookings
      db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          restaurant_id INTEGER NOT NULL,
          table_id INTEGER NOT NULL,
          booking_date DATE NOT NULL,
          booking_time TIME NOT NULL,
          duration INTEGER DEFAULT 120,
          guest_count INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          total_amount REAL DEFAULT 0,
          is_surprise INTEGER DEFAULT 0,
          special_occasion TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
          FOREIGN KEY (table_id) REFERENCES tables(id)
        )
      `);

      // Pre-orders
      db.run(`
        CREATE TABLE IF NOT EXISTS pre_orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id INTEGER NOT NULL,
          menu_item_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          special_instructions TEXT,
          price_at_order REAL,
          FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
          FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
        )
      `);

      // Special requests
      db.run(`
        CREATE TABLE IF NOT EXISTS special_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id INTEGER NOT NULL,
          request_type TEXT,
          details TEXT,
          price REAL DEFAULT 0,
          is_fulfilled INTEGER DEFAULT 0,
          FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
        )
      `);

      // Payments
      db.run(`
        CREATE TABLE IF NOT EXISTS payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          amount REAL NOT NULL,
          payment_method TEXT,
          payment_status TEXT DEFAULT 'pending',
          transaction_id TEXT,
          payment_gateway TEXT,
          paid_at DATETIME,
          FOREIGN KEY (booking_id) REFERENCES bookings(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Reviews
      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          restaurant_id INTEGER NOT NULL,
          booking_id INTEGER,
          rating INTEGER NOT NULL,
          comment TEXT,
          images TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
          FOREIGN KEY (booking_id) REFERENCES bookings(id)
        )
      `);

      // Favorites
      db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          restaurant_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
          UNIQUE(user_id, restaurant_id)
        )
      `);

      // Notifications
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT,
          is_read INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating tables:', err.message);
          reject(err);
        } else {
          console.log('✅ All database tables initialized successfully');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initDatabase };
