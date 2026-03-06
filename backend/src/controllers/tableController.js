const { db } = require('../config/database');

// Create table
const createTable = (req, res) => {
  const {
    restaurant_id,
    table_number,
    capacity,
    location_type,
    position_x,
    position_y,
    special_features,
  } = req.body;

  const sql = `
    INSERT INTO tables (
      restaurant_id, table_number, capacity, location_type,
      position_x, position_y, special_features
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const featuresJson = special_features ? JSON.stringify(special_features) : null;

  const params = [
    restaurant_id,
    table_number,
    capacity,
    location_type,
    position_x,
    position_y,
    featuresJson,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create table',
        error: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Table created successfully',
      data: {
        id: this.lastID,
        ...req.body,
      },
    });
  });
};

// Update table
const updateTable = (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // Convert special_features to JSON if present
  if (updates.special_features) {
    updates.special_features = JSON.stringify(updates.special_features);
  }

  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((f) => `${f} = ?`).join(', ');

  const sql = `UPDATE tables SET ${setClause} WHERE id = ?`;
  values.push(id);

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update table',
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: 'Table updated successfully',
    });
  });
};

// Delete table
const deleteTable = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tables WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete table',
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: 'Table deleted successfully',
    });
  });
};

module.exports = {
  createTable,
  updateTable,
  deleteTable,
};
