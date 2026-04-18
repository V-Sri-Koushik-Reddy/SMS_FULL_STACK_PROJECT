// =====================================================
// middleware/authMiddleware.js
// Protects routes — verifies Bearer JWT in header
// =====================================================

const { verifyToken } = require("../utils/jwtUtils");

/**
 * Express middleware that:
 *  1. Reads the Authorization header
 *  2. Extracts the Bearer token
 *  3. Verifies it with the JWT secret
 *  4. Attaches the decoded user payload to req.user
 *  5. Calls next() on success, or returns 401 on failure
 */
const protect = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  // Header must exist and look like "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;   // attach payload { id, email, role, iat, exp }
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Token has expired. Please log in again."
        : "Invalid token. Please log in again.";

    return res.status(401).json({ success: false, message });
  }
};

module.exports = { protect };
