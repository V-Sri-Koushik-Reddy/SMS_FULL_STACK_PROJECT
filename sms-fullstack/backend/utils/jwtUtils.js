// =====================================================
// utils/jwtUtils.js
// Thin wrappers around jsonwebtoken for sign / verify
// =====================================================

const jwt = require("jsonwebtoken");

const JWT_SECRET  = "secret123";   // per spec — store in .env in production
const JWT_EXPIRES = "1h";

/**
 * Sign a payload and return a JWT string.
 * @param {object} payload  Data to embed (e.g. { id, email, role })
 * @returns {string}  Signed JWT
 */
const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

/**
 * Verify a JWT and return its decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {object}  Decoded payload
 */
const verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET);

module.exports = { signToken, verifyToken, JWT_SECRET };
