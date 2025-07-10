const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Register route
router.post("/register", (req, res) => {
  const { name, password, role, address, mobile, dob } = req.body;

  if (role !== "farmer" && role !== "buyer") {
    return res.status(400).json({ error: "Invalid role" });
  }

  const table = role === "farmer" ? "farmers" : "buyers";
  const sql = `INSERT INTO ${table} (name, password, address, mobile, dob) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, password, address, mobile, dob], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ message: `${role} registered successfully` });
  });
});

// Login route
router.post("/login", (req, res) => {
  const { name, password, role } = req.body;

  if (role === "admin" && name === "admin" && password === "admin") {
    const token = jwt.sign({ role: "admin", name: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({
      message: "Admin login successful",
      token,
      user: { role: "admin", name: "admin" },
    });
  }

  if (role !== "farmer" && role !== "buyer") {
    return res.status(400).json({ error: "Invalid role" });
  }

  const table = role === "farmer" ? "farmers" : "buyers";
  const sql = `SELECT * FROM ${table} WHERE name = ?`;

  db.query(sql, [name], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    if (user.password.trim() !== password.trim()) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token, user: { ...user, role } });
  });
});

module.exports = router;
