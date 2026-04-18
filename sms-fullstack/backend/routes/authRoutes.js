// =====================================================
// routes/authRoutes.js
// Public authentication endpoints (no JWT required)
// =====================================================

const express        = require("express");
const router         = express.Router();
const { register, login } = require("../controllers/authController");

// POST /auth/register → create new user
router.post("/register", register);

// POST /auth/login  → issue JWT
router.post("/login", login);


module.exports = router;
