const { db } = require('../config/database');

// Create menu item
const createMenuItem = (req, res) => {
  const {
    restaurant_id,
    name,
    description,
    category,
    price,
    is_vegetarian,
    preparation_time,
  } = req.body;

  const sql = `
    INSERT INTO menu_items (
      restaurant_id, name, description, category, price,
      is_vegetarian, preparation_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    restaurant_id,
    name,
    description,
    category,
    price,
    is_vegetarian ? 1 : 0,
    preparation_time,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create menu item',
        error: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: {
        id: this.lastID,
        ...req.body,
      },
    });
  });
};

// Update menu item
const updateMenuItem = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((f) => `${f} = ?`).join(', ');

  const sql = `UPDATE menu_items SET ${setClause} WHERE id = ?`;
  values.push(id);

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update menu item',
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
    });
  });
};

// Delete menu item
const deleteMenuItem = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM menu_items WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete menu item',
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  });
};

module.exports = {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
