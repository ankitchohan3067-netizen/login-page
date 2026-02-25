// backend/server.js
const express = require("express");
const cors = require("cors");

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");      // login/signup
const adminRoutes = require("./routes/adminRoutes");    // admin dashboard

const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());

// ===== API ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));