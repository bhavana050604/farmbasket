// backend/index.js
const express = require("express");
const cors = require("cors");
const app = express();
const adminRoutes = require("./routes/admin");

app.use(cors());
app.use(express.json());

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);


// All API routes
app.use("/api/admin", adminRoutes);

// Add farmerRoutes, buyerRoutes etc later

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
