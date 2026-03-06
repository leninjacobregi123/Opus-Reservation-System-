const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../bookmyseat.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Starting database seeding...\n');

const seed = async () => {
  try {
    const password_hash = await bcrypt.hash('password123', 10);

    db.serialize(() => {
      // Clear existing data
      console.log('🗑️  Clearing existing data...');
      db.run('DELETE FROM pre_orders');
      db.run('DELETE FROM special_requests');
      db.run('DELETE FROM payments');
      db.run('DELETE FROM reviews');
      db.run('DELETE FROM favorites');
      db.run('DELETE FROM notifications');
      db.run('DELETE FROM bookings');
      db.run('DELETE FROM menu_items');
      db.run('DELETE FROM tables');
      db.run('DELETE FROM restaurants');
      db.run('DELETE FROM users');

      // Insert users
      console.log('👥 Creating users...');
      const userStmt = db.prepare(`
        INSERT INTO users (email, password_hash, full_name, phone, role)
        VALUES (?, ?, ?, ?, ?)
      `);

      userStmt.run('john@example.com', password_hash, 'John Doe', '9876543210', 'customer');
      userStmt.run('alice@example.com', password_hash, 'Alice Smith', '9876543211', 'customer');
      userStmt.run('owner@restaurant.com', password_hash, 'Restaurant Owner', '9876543212', 'restaurant_owner');
      userStmt.run('admin@bookmyseat.com', password_hash, 'Admin User', '9876543213', 'admin');
      userStmt.finalize();

      // Insert restaurants
      console.log('🍽️  Creating restaurants...');
      const restaurantStmt = db.prepare(`
        INSERT INTO restaurants (
          owner_id, name, description, cuisine_type, address, city,
          phone, email, price_range, opening_time, closing_time,
          rating, images, is_verified, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const restaurantImages = JSON.stringify([
        '/uploads/restaurants/sample1.jpg',
        '/uploads/restaurants/sample2.jpg',
      ]);

      restaurantStmt.run(
        3,
        'The Royal Bistro',
        'Elegant fine dining with breathtaking city views. Perfect for romantic dates and special celebrations.',
        'Multi-Cuisine',
        '123 Main Street, Downtown',
        'Mumbai',
        '022-12345678',
        'contact@royalbistro.com',
        '$$$$',
        '11:00',
        '23:00',
        4.8,
        restaurantImages,
        1,
        1
      );

      restaurantStmt.run(
        3,
        'Italiano Delights',
        'Authentic Italian cuisine with homemade pasta and wood-fired pizzas.',
        'Italian',
        '456 Park Avenue',
        'Mumbai',
        '022-87654321',
        'info@italianodelights.com',
        '$$$',
        '12:00',
        '22:30',
        4.6,
        restaurantImages,
        1,
        1
      );

      restaurantStmt.run(
        3,
        'Spice Garden',
        'Traditional Indian flavors with a modern twist. Rooftop seating available.',
        'Indian',
        '789 Garden Road',
        'Delhi',
        '011-55667788',
        'hello@spicegarden.com',
        '$$',
        '11:30',
        '23:00',
        4.5,
        restaurantImages,
        1,
        1
      );

      restaurantStmt.finalize();

      // Insert tables
      console.log('🪑 Creating tables...');
      const tableStmt = db.prepare(`
        INSERT INTO tables (
          restaurant_id, table_number, capacity, location_type,
          position_x, position_y, special_features
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      // The Royal Bistro tables
      tableStmt.run(1, 'W1', 2, 'window', 100, 100, JSON.stringify(['AC', 'City View']));
      tableStmt.run(1, 'W2', 2, 'window', 100, 200, JSON.stringify(['AC', 'City View']));
      tableStmt.run(1, 'W3', 4, 'window', 100, 300, JSON.stringify(['AC', 'City View', 'Large Table']));
      tableStmt.run(1, 'B1', 2, 'balcony', 300, 100, JSON.stringify(['Outdoor', 'Romantic']));
      tableStmt.run(1, 'B2', 4, 'balcony', 300, 200, JSON.stringify(['Outdoor', 'Romantic']));
      tableStmt.run(1, 'I1', 4, 'indoor', 500, 150, JSON.stringify(['AC', 'Quiet']));
      tableStmt.run(1, 'I2', 6, 'indoor', 500, 250, JSON.stringify(['AC', 'Large Table']));
      tableStmt.run(1, 'P1', 8, 'private', 700, 200, JSON.stringify(['Private Room', 'AC', 'Music System']));

      // Italiano Delights tables
      tableStmt.run(2, 'T1', 2, 'window', 120, 120, JSON.stringify(['Garden View']));
      tableStmt.run(2, 'T2', 4, 'window', 120, 240, JSON.stringify(['Garden View']));
      tableStmt.run(2, 'T3', 2, 'indoor', 350, 180, JSON.stringify(['Cozy Corner']));
      tableStmt.run(2, 'T4', 6, 'indoor', 550, 200, JSON.stringify(['Family Table']));

      // Spice Garden tables (Rooftop)
      tableStmt.run(3, 'R1', 2, 'rooftop', 150, 100, JSON.stringify(['Open Air', 'Starlit']));
      tableStmt.run(3, 'R2', 2, 'rooftop', 150, 200, JSON.stringify(['Open Air', 'Starlit']));
      tableStmt.run(3, 'R3', 4, 'rooftop', 350, 150, JSON.stringify(['Open Air', 'Candlelit']));
      tableStmt.run(3, 'R4', 6, 'rooftop', 550, 180, JSON.stringify(['Open Air', 'Large Table']));

      tableStmt.finalize();

      // Insert menu items
      console.log('🍕 Creating menu items...');
      const menuStmt = db.prepare(`
        INSERT INTO menu_items (
          restaurant_id, name, description, category, price,
          is_vegetarian, preparation_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      // The Royal Bistro menu
      menuStmt.run(1, 'Caesar Salad', 'Fresh romaine lettuce with parmesan and croutons', 'starter', 450, 1, 10);
      menuStmt.run(1, 'Grilled Salmon', 'Atlantic salmon with herb butter', 'main_course', 1200, 0, 25);
      menuStmt.run(1, 'Chocolate Lava Cake', 'Warm chocolate cake with vanilla ice cream', 'dessert', 350, 1, 15);
      menuStmt.run(1, 'Red Wine', 'Premium house wine', 'beverage', 800, 1, 5);

      // Italiano Delights menu
      menuStmt.run(2, 'Bruschetta', 'Toasted bread with tomatoes and basil', 'appetizer', 300, 1, 10);
      menuStmt.run(2, 'Margherita Pizza', 'Classic pizza with mozzarella and basil', 'main_course', 550, 1, 20);
      menuStmt.run(2, 'Fettuccine Alfredo', 'Creamy pasta with parmesan', 'main_course', 650, 1, 18);
      menuStmt.run(2, 'Tiramisu', 'Italian coffee-flavored dessert', 'dessert', 380, 1, 10);

      // Spice Garden menu
      menuStmt.run(3, 'Paneer Tikka', 'Grilled cottage cheese with spices', 'starter', 320, 1, 15);
      menuStmt.run(3, 'Butter Chicken', 'Creamy tomato-based chicken curry', 'main_course', 480, 0, 20);
      menuStmt.run(3, 'Dal Makhani', 'Black lentils in rich gravy', 'main_course', 350, 1, 25);
      menuStmt.run(3, 'Gulab Jamun', 'Sweet milk dumplings in syrup', 'dessert', 150, 1, 5);

      menuStmt.finalize();

      // Insert sample bookings
      console.log('📅 Creating sample bookings...');
      const bookingStmt = db.prepare(`
        INSERT INTO bookings (
          user_id, restaurant_id, table_id, booking_date, booking_time,
          guest_count, status, is_surprise, special_occasion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formatDate = (date) => date.toISOString().split('T')[0];

      // Past booking (completed)
      bookingStmt.run(1, 1, 1, formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)), '19:00', 2, 'completed', 0, 'date');

      // Today's booking (confirmed)
      bookingStmt.run(1, 1, 4, formatDate(today), '20:00', 2, 'confirmed', 1, 'anniversary');

      // Future bookings
      bookingStmt.run(2, 2, 9, formatDate(tomorrow), '19:30', 4, 'pending', 0, 'birthday');
      bookingStmt.run(1, 3, 17, formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)), '21:00', 2, 'confirmed', 0, 'casual');

      bookingStmt.finalize();

      console.log('\n✅ Database seeded successfully!\n');
      console.log('📊 Summary:');
      console.log('   - 4 Users created (password: password123)');
      console.log('   - 3 Restaurants');
      console.log('   - 20 Tables');
      console.log('   - 12 Menu Items');
      console.log('   - 4 Sample Bookings\n');
      console.log('🔑 Login credentials:');
      console.log('   Customer: john@example.com / password123');
      console.log('   Owner: owner@restaurant.com / password123');
      console.log('   Admin: admin@bookmyseat.com / password123\n');

      db.close();
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    db.close();
  }
};

seed();
