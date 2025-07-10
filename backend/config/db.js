const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Karthik@564",
  database: "efarming",
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection failed:", err);
  } else {
    console.log("MySQL connected ✅");
  }
});

module.exports = db;