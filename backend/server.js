const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const farmerRoutes = require("./routes/farmer");
const buyerRoutes = require('./routes/buyer');
const paymentRoutes = require('./routes/payment');


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/buyer", buyerRoutes); // ✅ correct
app.use('/api/payment', paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
