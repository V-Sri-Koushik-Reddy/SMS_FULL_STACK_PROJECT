// =====================================================
// server.js  —  Scholar SMS backend entry point
// =====================================================

const express      = require("express");
const cors         = require("cors");
const authRoutes   = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app  = express();
const PORT = process.env.PORT || 5004;

// ── Global middleware ──────────────────────────────
app.use(cors());              // allow all origins (tighten in production)
app.use(express.json());      // parse JSON bodies

// ── API routes ─────────────────────────────────────
app.get("/", (_, res) =>
  res.json({
    success:   true,
    message:   "🎓 Scholar SMS API is running!",
    endpoints: {
      "POST /auth/login":     "Get a JWT token",
      "GET  /students":       "List all students (auth required)",
      "POST /students":       "Add a student (auth required)",
      "PUT  /students/:id":   "Update a student (auth required)",
      "DELETE /students/:id": "Delete a student (auth required)",
    },
  })
);

app.use("/auth",     authRoutes);
app.use("/students", studentRoutes);

// ── Error handling ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Server running  →  http://localhost:${PORT}`);
  console.log(`🔐  Login           →  POST http://localhost:${PORT}/auth/login`);
  console.log(`👨‍🎓  Students        →  http://localhost:${PORT}/students\n`);
  console.log(`    Default admin:  admin@example.com / admin123\n`);
});
