// ✅ BACKEND: routes/admin.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all farmers
router.get("/farmers", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT name, address, mobile, dob FROM farmers");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

// Get all buyers
router.get("/buyers", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT name, address, mobile, dob FROM buyers");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch buyers" });
  }
});

// Get all products with farmer names and convert image buffer to base64
router.get("/products", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        products.id, 
        products.name, 
        products.image, 
        products.price, 
        products.quantity, 
        farmers.name AS farmer_name 
      FROM products 
      JOIN farmers ON products.farmer_id = farmers.id
    `);

    // Convert image buffer to base64
    const productsWithBase64 = rows.map((row) => ({
      ...row,
      image: row.image ? Buffer.from(row.image).toString("base64") : null,
    }));

    res.json(productsWithBase64);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// Get all delivery records
router.get("/delivery", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM delivery");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching delivery:", err);
    res.status(500).json({ error: "Failed to fetch delivery" });
  }
});

module.exports = router;
