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

  // Password: min 6 chars, 1 uppercase, 1 special char, 1 number
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: "Password must contain at least one uppercase letter." });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: "Password must contain at least one number." });
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ error: "Password must contain at least one special character." });
  }
  // Mobile: required, 10 digits
  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: "Mobile number must be exactly 10 digits." });
  }
  // DOB: required, valid date, at least 18 years old
  if (!dob) {
    return res.status(400).json({ error: "Date of birth is required." });
  }
  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) {
    return res.status(400).json({ error: "Invalid date of birth." });
  }
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (
    age < 18 ||
    (age === 18 && m < 0) ||
    (age === 18 && m === 0 && today.getDate() < dobDate.getDate())
  ) {
    return res.status(400).json({ error: "You must be at least 18 years old." });
  }

  const table = role === "farmer" ? "farmers" : "buyers";
  const sql = `INSERT INTO ${table} (name, password, address, mobile, dob) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [name, password, address, mobile, dob], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Username already exists." });
      }
      return res.status(500).json({ error: err.message });
    }
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
