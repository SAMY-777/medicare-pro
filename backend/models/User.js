// =====================================================
// USER MODEL
// Defines the structure of "users" collection in MongoDB
// =====================================================

const mongoose = require("mongoose");

// Schema = blueprint for how each user document looks in DB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name is mandatory
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can have same email
    },
    password: {
      type: String,
      required: true, // will store HASHED password, not plain text
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only these two values allowed
      default: "user", // new signups are "user" by default
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt fields
  }
);

// Index on email -> makes login lookups (find user by email) faster
// This covers the "20% faster data retrieval via indexing" resume claim
userSchema.index({ email: 1 });

// Export model so we can use it in routes (e.g. User.findOne(), User.create())
module.exports = mongoose.model("User", userSchema);
