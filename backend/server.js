// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const farmerRoutes = require("./routes/farmer");
const buyerRoutes = require("./routes/buyer");
const paymentRoutes = require("./routes/payment"); // ✅ This is the key

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Mounting all routers
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/payment", paymentRoutes); // ✅ This must be before the 404

app.get("/", (req, res) => {
  res.send("EFarming backend is live ✅");
});

// ❌ This catches all remaining routes — keep it LAST
app.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
