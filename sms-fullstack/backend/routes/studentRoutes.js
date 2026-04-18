// =====================================================
// routes/studentRoutes.js
// All student routes require a valid Bearer JWT
// =====================================================

const express    = require("express");
const router     = express.Router();

const { protect }                        = require("../middleware/authMiddleware");
const { validateCreate, validateUpdate } = require("../middleware/validationMiddleware");
const {
  getStudents, createStudent, editStudent, removeStudent,
} = require("../controllers/studentController");

// Every route in this file is protected
router.use(protect);

router.get   ("/",    getStudents);
router.post  ("/",    validateCreate, createStudent);
router.put   ("/:id", validateUpdate, editStudent);
router.delete("/:id", removeStudent);

module.exports = router;
