// =====================================================
// SERVER.JS - Main entry point of the backend
// This file: starts Express server, connects to MongoDB,
// and registers all routes
// =====================================================

// Load environment variables from .env file FIRST
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import route files
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");

// Create Express app
const app = express();

// -----------------------------------------------------
// MIDDLEWARE (runs on EVERY request before reaching routes)
// -----------------------------------------------------

// cors() -> allows frontend (different port/domain) to call this backend
app.use(cors());

// express.json() -> allows server to read JSON data sent in request body
// (e.g. when frontend sends { name, email, password })
app.use(express.json());

// -----------------------------------------------------
// ROUTES
// -----------------------------------------------------

// Any request to /api/auth/... goes to authRoutes
// e.g. POST /api/auth/signup, POST /api/auth/login
app.use("/api/auth", authRoutes);

// Any request to /api/appointments/... goes to appointmentRoutes
// e.g. GET /api/appointments/my, POST /api/appointments
app.use("/api/appointments", appointmentRoutes);

// Simple test route to check if server is running
app.get("/", (req, res) => {
  res.send("MediCare Pro API is running...");
});

// -----------------------------------------------------
// CONNECT TO MONGODB & START SERVER
// -----------------------------------------------------

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI) // connect using URI from .env
  .then(() => {
    console.log("MongoDB connected successfully");

    // Only start server AFTER successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
