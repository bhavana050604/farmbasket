// 📦 BACKEND: routes/farmer.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../config/db");
const util = require("util");

const query = util.promisify(db.query).bind(db);
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Add Product with quantity
router.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    const { name, price, quantity, farmer_id } = req.body;
    const image = req.file?.buffer;

    if (!name || !price || !quantity || !farmer_id || !image) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await query(
      "INSERT INTO products (name, price, quantity, image, farmer_id) VALUES (?, ?, ?, ?, ?)",
      [name, price, quantity, image, farmer_id]
    );
    res.status(201).json({ message: "Product added" });
  } catch (err) {
    console.error("Add error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all products by farmer ID
router.get("/products/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const rows = await query(
      "SELECT id, name, price, quantity, TO_BASE64(image) as image FROM products WHERE farmer_id = ?",
      [farmerId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Delete product by ID
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ✅ Update price and quantity of product
router.put("/updateProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { price, quantity } = req.body;
    await query("UPDATE products SET price = ?, quantity = ? WHERE id = ?", [price, quantity, id]);
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

module.exports = router;
