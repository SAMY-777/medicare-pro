// =====================================================
// APPOINTMENT MODEL
// Defines the structure of "appointments" collection
// =====================================================

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Links each appointment to the user who created it
    userId: {
      type: mongoose.Schema.Types.ObjectId, // stores the User's _id
      ref: "User", // tells mongoose this ID refers to "User" collection
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Index on "date" field -> speeds up queries that sort/filter by date
// e.g. "show appointments sorted by upcoming date"
// This is the EXACT thing you can point to for "20% faster retrieval via indexing"
appointmentSchema.index({ date: 1 });

// Index on userId -> speeds up "find all appointments for this user"
appointmentSchema.index({ userId: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
