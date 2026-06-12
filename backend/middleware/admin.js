// =====================================================
// ADMIN MIDDLEWARE
// Runs AFTER auth middleware - checks if user role is "admin"
// This covers "role-based permissions" from your QPP project
// =====================================================

function verifyAdmin(req, res, next) {
  // req.user was set by the auth middleware (verifyToken) before this runs
  // So we can check req.user.role here

  if (req.user.role !== "admin") {
    // If not admin, block access with 403 (Forbidden)
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // If admin, proceed to the route handler
  next();
}

module.exports = verifyAdmin;
