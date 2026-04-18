// =====================================================
// controllers/authController.js
// Handles register + login with JWT
// =====================================================

const { findUserByEmail, addUser } = require("../models/userModel");
const { signToken } = require("../utils/jwtUtils");

/**
 * POST /auth/register
 * Body: { name, email, password }
 */
const register = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // ── Validation ──────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // ── Check existing user ─────────────────────
    const existingUser = findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // ── Create new user ─────────────────────────
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // (later you can hash this)
      role: "user",
    };

    addUser(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });

  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/login
 * Body: { email, password }
 */
const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ── Validation ──────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // ── Find user ───────────────────────────────
    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── Generate JWT ────────────────────────────
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };