const { db, initDatabase } = require('./src/config/database');

const applyHardConstraint = async () => {
  console.log("Applying Unique Table/Time Constraint...");
  
  try {
    await initDatabase();
    
    db.serialize(() => {
      // 1. Remove any duplicate test data first
      db.run("DELETE FROM bookings WHERE id NOT IN (SELECT MIN(id) FROM bookings GROUP BY table_id, booking_date, booking_time)");
      
      // 2. Add Unique Index
      db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_one_booking_per_slot ON bookings (table_id, booking_date, booking_time)", (err) => {
        if (err) {
          console.error("❌ Failed to apply constraint:", err.message);
        } else {
          console.log("✅ Hard constraint applied successfully. Double-booking is now physically impossible at the DB level.");
        }
      });
    });
  } catch (err) {
    console.error("Initialization failed", err);
  }
};

applyHardConstraint();
