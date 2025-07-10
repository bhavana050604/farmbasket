// ✅ BACKEND: routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_SQFxBYUAD5nGdv", // ✅ Your test key
  key_secret: "Dr8INiqJCRzaavOqjm1dr5o2", // ✅ Your test secret
});

router.post("/order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount, // amount in paise (100 = ₹1)
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
