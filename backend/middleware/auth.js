// =====================================================
// AUTH MIDDLEWARE
// Runs BEFORE protected routes to check if user is logged in
// =====================================================

const jwt = require("jsonwebtoken");

// This function checks: "Does this request have a valid JWT token?"
function verifyToken(req, res, next) {
  // Token is sent in header like: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  // If no header or doesn't start with "Bearer ", reject request
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  // Extract just the token part (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Verify token using our secret key (from .env)
    // If valid, this returns the data we stored in token (id, role)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object so next routes can use it
    // e.g. req.user.id, req.user.role
    req.user = decoded;

    // next() means "okay, proceed to the actual route handler"
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = verifyToken;
