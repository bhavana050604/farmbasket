const express = require("express");
const router = express.Router();
const db = require("../config/db");
const util = require("util");

const query = util.promisify(db.query).bind(db);

// ✅ GET all farmers
router.get("/farmers", async (req, res) => {
  try {
    const farmers = await query("SELECT name, address, mobile, dob FROM farmers");
    res.json(farmers);
  } catch (err) {
    console.error("Error fetching farmers:", err);
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

// ✅ GET all buyers
router.get("/buyers", async (req, res) => {
  try {
    const buyers = await query("SELECT name, address, mobile, dob FROM buyers");
    res.json(buyers);
  } catch (err) {
    console.error("Error fetching buyers:", err);
    res.status(500).json({ error: "Failed to fetch buyers" });
  }
});

// ✅ GET all products with farmer name
router.get("/products", async (req, res) => {
  try {
    const products = await query(`
      SELECT p.id, p.name, p.price, p.quantity, p.image, f.name AS farmer_name
      FROM products p
      JOIN farmers f ON p.farmer_id = f.id
    `);
    const base64Products = products.map(p => ({
      ...p,
      image: p.image ? Buffer.from(p.image).toString("base64") : null,
    }));
    res.json(base64Products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ GET delivery/order details from orders table
router.get("/delivery", async (req, res) => {
  try {
    const deliveries = await query(`
      SELECT 
        b.name,
        o.address,
        o.mobile,
        o.pincode,
        o.city,
        o.state,
        o.created_at
      FROM orders o
      JOIN buyers b ON o.buyer_id = b.id
    `);
    res.json(deliveries);
  } catch (err) {
    console.error("❌ Error fetching deliveries:", err);
    res.status(500).json({ error: "Failed to fetch delivery details" });
  }
});


module.exports = router;
