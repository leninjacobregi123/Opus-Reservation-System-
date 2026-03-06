const { db } = require('../config/database');

// Get all restaurants with filters
const getAllRestaurants = (req, res) => {
  const { city, cuisine_type, price_range, search } = req.query;

  let sql = 'SELECT * FROM restaurants WHERE is_active = 1';
  const params = [];

  if (city) {
    sql += ' AND city = ?';
    params.push(city);
  }

  if (cuisine_type) {
    sql += ' AND cuisine_type = ?';
    params.push(cuisine_type);
  }

  if (price_range) {
    sql += ' AND price_range = ?';
    params.push(price_range);
  }

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY rating DESC, created_at DESC';

  db.all(sql, params, (err, restaurants) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch restaurants',
        error: err.message,
      });
    }

    // Parse JSON fields
    const formattedRestaurants = restaurants.map((r) => ({
      ...r,
      images: r.images ? JSON.parse(r.images) : [],
      floor_plan: r.floor_plan ? JSON.parse(r.floor_plan) : null,
    }));

    res.json({
      success: true,
      count: formattedRestaurants.length,
      data: formattedRestaurants,
    });
  });
};

// Get single restaurant by ID
const getRestaurantById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM restaurants WHERE id = ?', [id], (err, restaurant) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message,
      });
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Parse JSON fields
    restaurant.images = restaurant.images ? JSON.parse(restaurant.images) : [];
    restaurant.floor_plan = restaurant.floor_plan ? JSON.parse(restaurant.floor_plan) : null;

    res.json({
      success: true,
      data: restaurant,
    });
  });
};

// Create new restaurant
const createRestaurant = (req, res) => {
  const userId = req.user.id;
  const {
    name,
    description,
    cuisine_type,
    address,
    city,
    phone,
    email,
    price_range,
    opening_time,
    closing_time,
    latitude,
    longitude,
  } = req.body;

  const sql = `
    INSERT INTO restaurants (
      owner_id, name, description, cuisine_type, address, city,
      phone, email, price_range, opening_time, closing_time,
      latitude, longitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    userId,
    name,
    description,
    cuisine_type,
    address,
    city,
    phone,
    email,
    price_range,
    opening_time,
    closing_time,
    latitude,
    longitude,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create restaurant',
        error: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: {
        id: this.lastID,
        ...req.body,
      },
    });
  });
};

// Update restaurant
const updateRestaurant = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updates = req.body;

  // Check if user owns the restaurant or is admin
  db.get('SELECT owner_id FROM restaurants WHERE id = ?', [id], (err, restaurant) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message,
      });
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this restaurant',
      });
    }

    // Build update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');

    const sql = `UPDATE restaurants SET ${setClause} WHERE id = ?`;
    values.push(id);

    db.run(sql, values, function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update restaurant',
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: 'Restaurant updated successfully',
      });
    });
  });
};

// Delete restaurant
const deleteRestaurant = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check ownership
  db.get('SELECT owner_id FROM restaurants WHERE id = ?', [id], (err, restaurant) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message,
      });
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this restaurant',
      });
    }

    db.run('DELETE FROM restaurants WHERE id = ?', [id], function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to delete restaurant',
          error: err.message,
        });
      }

      res.json({
        success: true,
        message: 'Restaurant deleted successfully',
      });
    });
  });
};

// Get restaurant tables
const getRestaurantTables = (req, res) => {
  const { id } = req.params;

  db.all('SELECT * FROM tables WHERE restaurant_id = ?', [id], (err, tables) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tables',
        error: err.message,
      });
    }

    // Parse special_features JSON
    const formattedTables = tables.map((t) => ({
      ...t,
      special_features: t.special_features ? JSON.parse(t.special_features) : [],
    }));

    res.json({
      success: true,
      count: formattedTables.length,
      data: formattedTables,
    });
  });
};

// Get restaurant menu
const getRestaurantMenu = (req, res) => {
  const { id } = req.params;
  const { category } = req.query;

  let sql = 'SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = 1';
  const params = [id];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ' ORDER BY category, name';

  db.all(sql, params, (err, menuItems) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch menu',
        error: err.message,
      });
    }

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  });
};

// Get restaurant reviews
const getRestaurantReviews = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT r.*, u.full_name, u.profile_image
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.restaurant_id = ?
    ORDER BY r.created_at DESC
  `;

  db.all(sql, [id], (err, reviews) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
        error: err.message,
      });
    }

    // Parse images JSON
    const formattedReviews = reviews.map((r) => ({
      ...r,
      images: r.images ? JSON.parse(r.images) : [],
    }));

    res.json({
      success: true,
      count: formattedReviews.length,
      data: formattedReviews,
    });
  });
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantTables,
  getRestaurantMenu,
  getRestaurantReviews,
};
