const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./seats.db', (err) => {
  if (err) {
    console.error("Error connecting to SQLite DB:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS seats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_number TEXT NOT NULL,
      status TEXT DEFAULT 'available'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seat_id INTEGER,
      user_name TEXT,
      FOREIGN KEY (seat_id) REFERENCES seats(id)
    )
  `);
});

// Get all seats
app.get('/api/seats', (req, res) => {
  const sql = "SELECT * FROM seats";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching seats:", err.message);
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "success", data: rows });
  });
});

// Add a new seat (optional)
app.post('/api/seats', (req, res) => {
  const { seat_number } = req.body;
  const sql = "INSERT INTO seats (seat_number) VALUES (?)";
  db.run(sql, [seat_number], function (err) {
    if (err) {
      console.error("Error adding seat:", err.message);
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: "Seat added successfully",
      data: {
        id: this.lastID,
        seat_number,
        status: "available"
      }
    });
  });
});

// Reserve a seat
app.post('/api/reserve', (req, res) => {
  const { seat_id, user_name } = req.body;

  const checkSql = "SELECT * FROM seats WHERE id = ? AND status = 'available'";
  db.get(checkSql, [seat_id], (err, seat) => {
    if (err) {
      console.error("Error checking seat:", err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!seat) {
      return res.status(400).json({ error: "Seat is not available." });
    }

    const updateSql = "UPDATE seats SET status = 'reserved' WHERE id = ?";
    db.run(updateSql, [seat_id], function (err) {
      if (err) {
        console.error("Error updating seat:", err.message);
        return res.status(400).json({ error: err.message });
      }

      const insertSql = "INSERT INTO reservations (seat_id, user_name) VALUES (?, ?)";
      db.run(insertSql, [seat_id, user_name], function (err) {
        if (err) {
          console.error("Error logging reservation:", err.message);
          return res.status(400).json({ error: err.message });
        }

        res.json({
          message: "Seat reserved successfully",
          data: {
            reservation_id: this.lastID,
            seat_id,
            user_name
          }
        });
      });
    });
  });
});

// ✅ Get all reservations with seat numbers
app.get('/api/reservations', (req, res) => {
  const sql = `
    SELECT reservations.id AS reservation_id, user_name, seat_number
    FROM reservations
    JOIN seats ON reservations.seat_id = seats.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching reservations:", err.message);
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "success", data: rows });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
