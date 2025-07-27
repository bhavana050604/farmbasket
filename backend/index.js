// This file is not used for deployment. Use server.js as the entry point.
// backend/index.js
const express = require("express");
const cors = require("cors");
const app = express();
const adminRoutes = require("./routes/admin");

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);


// All API routes
// Add farmerRoutes, buyerRoutes etc later

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
