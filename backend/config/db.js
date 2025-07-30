const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Karthik@564",
  database: process.env.DB_NAME || "efarming",
  port: process.env.DB_PORT || 3306,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection failed:", err);
  } else {
    console.log("MySQL connected ✅");
  }
});

module.exports = db;