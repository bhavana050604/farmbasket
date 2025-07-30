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

// Configure CORS for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
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

// Test database connection endpoint
app.get("/api/test-db", (req, res) => {
  const db = require("./config/db");
  db.query("SELECT 1", (err, results) => {
    if (err) {
      res.status(500).json({ 
        status: "error", 
        message: "Database connection failed", 
        error: err.message 
      });
    } else {
      res.json({ 
        status: "success", 
        message: "Database connected successfully ✅",
        timestamp: new Date().toISOString()
      });
    }
  });
});

// ❌ This catches all remaining routes — keep it LAST
app.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));