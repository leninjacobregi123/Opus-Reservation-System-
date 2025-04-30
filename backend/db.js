// db.js
const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to SQLite database.');
        // Create the seats table (if not exists)
        db.run(`CREATE TABLE IF NOT EXISTS seats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seat_number TEXT UNIQUE,
            status TEXT DEFAULT 'available'
        )`, (err) => {
            if (err) {
                console.error("Error creating seats table:", err.message);
            } else {
                console.log("Seats table ready.");
            }
        });

        // Create the reservations table (if not exists)
        db.run(`CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seat_id INTEGER,
            user_name TEXT,
            reserved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seat_id) REFERENCES seats(id)
        )`, (err) => {
            if (err) {
                console.error("Error creating reservations table:", err.message);
            } else {
                console.log("Reservations table ready.");
            }
        });
    }
});

module.exports = db;
