const { db, initDatabase } = require('./src/config/database');
const bcrypt = require('bcryptjs');

const createSupremeAdmin = async () => {
  console.log("Establishing Supreme Admin Identity...");
  try {
    await initDatabase();
    const email = "leninjacob891@gmail.com";
    const password = "L14e02n2005.com";
    const password_hash = await bcrypt.hash(password, 10);

    db.serialize(() => {
      // Ensure user exists with Admin role
      db.run(`INSERT OR REPLACE INTO users (email, password_hash, full_name, role, phone) 
              VALUES (?, ?, ?, ?, ?)`, 
              [email, password_hash, "Maharaja Lenin Jacob", "admin", "9999999999"], 
              (err) => {
        if (err) console.error("❌ Failed to establish admin:", err.message);
        else console.log("✅ Supreme Admin Identity established successfully.");
      });
    });
  } catch (err) {
    console.error("Initialization failure", err);
  }
};

createSupremeAdmin();
