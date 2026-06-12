// =====================================================
// APPOINTMENT ROUTES
// Handles full CRUD: Create, Read, Update, Delete
// Plus role-based access (admin sees all, user sees only their own)
// =====================================================

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");

// -----------------------------------------------------
// CREATE - POST /api/appointments
// Logged-in user books a new appointment
// -----------------------------------------------------
router.post("/", verifyToken, async (req, res) => {
  try {
    const { doctorName, date, reason } = req.body;

    // Create appointment, linking it to the logged-in user's ID
    // req.user.id comes from the JWT token (set by verifyToken middleware)
    const appointment = await Appointment.create({
      userId: req.user.id,
      doctorName,
      date,
      reason,
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------------------------
// READ (USER) - GET /api/appointments/my
// Returns ONLY the logged-in user's appointments
// -----------------------------------------------------
router.get("/my", verifyToken, async (req, res) => {
  try {
    // Find appointments where userId matches the logged-in user
    // .sort({ date: 1 }) -> sorted by date ascending (uses our index!)
    const appointments = await Appointment.find({ userId: req.user.id }).sort({ date: 1 });

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------------------------
// READ (ADMIN) - GET /api/appointments/all
// Returns ALL appointments from ALL users (admin only)
// This covers "admin panel / role-based permissions" from QPP project
// -----------------------------------------------------
router.get("/all", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // .populate("userId", "name email") -> replaces userId with actual
    // user's name and email instead of just showing the ID
    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .sort({ date: 1 });

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------------------------
// UPDATE - PUT /api/appointments/:id
// Edit an existing appointment (only owner or admin can edit)
// -----------------------------------------------------
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check: is this the owner OR an admin?
    const isOwner = appointment.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to edit this appointment" });
    }

    // Update only the fields provided in request body
    const { doctorName, date, reason, status } = req.body;
    if (doctorName) appointment.doctorName = doctorName;
    if (date) appointment.date = date;
    if (reason) appointment.reason = reason;
    if (status) appointment.status = status;

    await appointment.save();

    res.status(200).json({ message: "Appointment updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// -----------------------------------------------------
// DELETE - DELETE /api/appointments/:id
// Remove an appointment (only owner or admin can delete)
// -----------------------------------------------------
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isOwner = appointment.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this appointment" });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
