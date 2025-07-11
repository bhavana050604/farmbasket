// routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

console.log("✅ payment.js route loaded"); // Must appear in terminal

const razorpay = new Razorpay({
  key_id: "rzp_test_SQFxBYUAD5nGdv",
  key_secret: "Dr8INiqJCRzaavOqjm1dr5o2",
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

module.exports = router;
