// =====================================================
// middleware/validationMiddleware.js
// Request body validation for student create/update
// =====================================================

/**
 * Validates POST /students body.
 * All three fields (name, rollNo, marks) are required.
 */
const validateCreate = (req, res, next) => {
  const { name, rollNo, marks } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim() === "")
    errors.push("name is required and must be a non-empty string.");

  if (!rollNo || typeof rollNo !== "string" || rollNo.trim() === "")
    errors.push("rollNo is required and must be a non-empty string.");

  const m = parseFloat(marks);
  if (marks === undefined || marks === null || marks === "")
    errors.push("marks is required.");
  else if (isNaN(m) || m < 0 || m > 100)
    errors.push("marks must be a number between 0 and 100.");

  if (errors.length)
    return res.status(400).json({ success: false, message: errors.join(" ") });

  // Normalise values on req.body so controllers get clean data
  req.body.name   = name.trim();
  req.body.rollNo = rollNo.trim();
  req.body.marks  = m;
  next();
};

/**
 * Validates PUT /students/:id body.
 * At least one field must be present; each field is validated if supplied.
 */
const validateUpdate = (req, res, next) => {
  const { name, rollNo, marks } = req.body;
  const errors = [];

  if (!name && !rollNo && marks === undefined)
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update: name, rollNo, marks.",
    });

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "")
      errors.push("name must be a non-empty string.");
    else req.body.name = name.trim();
  }

  if (rollNo !== undefined) {
    if (typeof rollNo !== "string" || rollNo.trim() === "")
      errors.push("rollNo must be a non-empty string.");
    else req.body.rollNo = rollNo.trim();
  }

  if (marks !== undefined) {
    const m = parseFloat(marks);
    if (isNaN(m) || m < 0 || m > 100)
      errors.push("marks must be a number between 0 and 100.");
    else req.body.marks = m;
  }

  if (errors.length)
    return res.status(400).json({ success: false, message: errors.join(" ") });

  next();
};

module.exports = { validateCreate, validateUpdate };
