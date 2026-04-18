// =====================================================
// middleware/errorMiddleware.js
// Global Express error handler (4-argument signature)
// =====================================================

/**
 * Catches any error passed to next(err) anywhere in the app.
 * Returns a consistent JSON error envelope.
 *
 * Usage anywhere in a route/controller:
 *   next(new Error("Something broke"))
 *   — or —
 *   const err = new Error("Not found"); err.status = 404; next(err);
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, err.message);

  const status  = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ success: false, message });
};

/**
 * 404 handler — mount AFTER all routes.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
};

module.exports = { errorHandler, notFound };
