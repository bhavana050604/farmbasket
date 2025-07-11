const express = require("express");
const router = express.Router();
const db = require("../config/db");
const util = require("util");

const query = util.promisify(db.query).bind(db);

// ✅ Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await query(`
      SELECT p.id, p.name, p.price, p.quantity, TO_BASE64(p.image) as image
      FROM products p
      WHERE p.quantity > 0
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Checkout
router.post("/checkout", async (req, res) => {
  const { buyer_id, cart, address, mobile, pincode, city, state } = req.body;

  if (!buyer_id || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    for (const item of cart) {
      const [product] = await query("SELECT price, quantity FROM products WHERE id = ?", [item.product_id]);

      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ID ${item.product_id}` });
      }

      const total = product.price * item.quantity;

      await query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [item.quantity, item.product_id]);

      await query(
        `INSERT INTO orders (buyer_id, product_id, product_name, quantity, total_price, address, mobile, pincode, city, state)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          buyer_id,
          item.product_id,
          item.name,
          item.quantity,
          total,
          address,
          mobile,
          pincode,
          city,
          state,
        ]
      );
    }

    res.json({ message: "Order placed successfully." });
  } catch (err) {
    console.error("❌ Checkout failed:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// ✅ Get orders for buyer
router.get("/orders/:buyerId", async (req, res) => {
  try {
    const { buyerId } = req.params;
    if (!buyerId || isNaN(buyerId)) return res.status(400).json({ error: "Invalid buyer ID" });

    const orders = await query("SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC", [buyerId]);
    res.json(orders);
  } catch (err) {
    console.error("❌ Order fetch failed:", err);
    res.status(500).json({ error: "Failed to get orders" });
  }
});

// ✅ Delete an order
router.delete("/orders/:id", async (req, res) => {
  try {
    await query("DELETE FROM orders WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
