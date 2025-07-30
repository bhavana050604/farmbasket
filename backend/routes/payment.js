// routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const db = require("../config/db");

console.log("✅ payment.js route loaded"); // Must appear in terminal

const razorpay = new Razorpay({
  key_id: "rzp_live_u4nn0qx73rY59W",
  key_secret: "bRsPg5D8RGgtTIlMURlJluoG",
});

// 🔄 Ping test
router.get("/ping", (req, res) => {
  res.send("✅ Payment route working");
});

// 💳 Create Razorpay order
router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount, // paise
      currency: "INR",
      receipt: `receipt_${Math.floor(Math.random() * 10000)}`,
      payment_capture: 1,
    });

    res.json(order);
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ Verify payment and create order
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    
    console.log("🔍 Verifying payment:", { razorpay_order_id, razorpay_payment_id });

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      console.error("❌ Payment signature verification failed");
      return res.status(400).json({ error: "Payment verification failed" });
    }

    console.log("✅ Payment verified successfully");

    // Create order in database
    const { buyer_id, product_id, quantity, total_amount, address, mobile, pincode, city, state } = orderData;
    
    const insertOrderQuery = `
      INSERT INTO orders (buyer_id, product_id, quantity, total_amount, status, address, mobile, pincode, city, state) 
      VALUES (?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?)
    `;

    db.query(insertOrderQuery, [
      buyer_id, product_id, quantity, total_amount, 
      address, mobile, pincode, city, state
    ], (err, result) => {
      if (err) {
        console.error("❌ Error creating order:", err);
        return res.status(500).json({ error: "Failed to create order in database" });
      }

      console.log("✅ Order created successfully:", result.insertId);
      
      // Update product quantity
      const updateProductQuery = `
        UPDATE products 
        SET quantity = quantity - ? 
        WHERE id = ? AND quantity >= ?
      `;
      
      db.query(updateProductQuery, [quantity, product_id, quantity], (updateErr) => {
        if (updateErr) {
          console.error("❌ Error updating product quantity:", updateErr);
        } else {
          console.log("✅ Product quantity updated");
        }
      });

      res.json({ 
        success: true, 
        message: "Payment verified and order created successfully",
        order_id: result.insertId 
      });
    });

  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
