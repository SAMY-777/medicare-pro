// =====================================================
// AUTH ROUTES
// Handles: POST /api/auth/signup and POST /api/auth/login
// =====================================================

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// -----------------------------------------------------
// SIGNUP ROUTE
// Creates a new user, hashes password, returns JWT token
// -----------------------------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Step 1: Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Step 2: Hash the password before saving (NEVER store plain text passwords)
    // "10" is the salt rounds - higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create new user in database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default to "user" if not provided
    });

    // Step 4: Generate JWT token (so user is logged in immediately after signup)
    // Token contains user's id and role - we'll need these later
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );

    // Step 5: Send back token + user info (excluding password)
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------------------------
// LOGIN ROUTE
// Verifies email/password, returns JWT token
// -----------------------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Step 2: Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Step 3: Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Step 4: Send token + user info back
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
