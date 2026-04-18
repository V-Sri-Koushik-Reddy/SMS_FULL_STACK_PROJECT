// =====================================================
// controllers/studentController.js
// CRUD + search/filter for the student resource
// =====================================================

const {
  getAllStudents, findById, searchByName,
  filterByMarks, addStudent, updateStudent, deleteStudent,
} = require("../models/studentModel");

// ── GET /students ─────────────────────────────────────
// Supports ?search=<name>  and/or  ?marksAbove=<number>
const getStudents = (req, res, next) => {
  try {
    const { search, marksAbove } = req.query;
    let result = getAllStudents();

    if (search && search.trim())
      result = result.filter((s) =>
        s.name.toLowerCase().includes(search.trim().toLowerCase()));

    if (marksAbove !== undefined) {
      const threshold = parseFloat(marksAbove);
      if (isNaN(threshold))
        return res.status(400).json({ success: false, message: "marksAbove must be a number." });
      result = result.filter((s) => s.marks > threshold);
    }

    res.json({ success: true, count: result.length, data: result });
  } catch (err) { next(err); }
};

// ── POST /students ────────────────────────────────────
// Body already validated by validateCreate middleware
const createStudent = (req, res, next) => {
  try {
    const { name, rollNo, marks } = req.body;
    const student = addStudent(name, rollNo, marks);
    res.status(201).json({ success: true, message: "Student added.", data: student });
  } catch (err) { next(err); }
};

// ── PUT /students/:id ─────────────────────────────────
// Body already validated by validateUpdate middleware
const editStudent = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return res.status(400).json({ success: false, message: "ID must be a number." });

    if (!findById(id))
      return res.status(404).json({ success: false, message: `Student ${id} not found.` });

    const { name, rollNo, marks } = req.body;
    const updates = {};
    if (name   !== undefined) updates.name   = name;
    if (rollNo !== undefined) updates.rollNo = rollNo;
    if (marks  !== undefined) updates.marks  = marks;

    const updated = updateStudent(id, updates);
    res.json({ success: true, message: "Student updated.", data: updated });
  } catch (err) { next(err); }
};

// ── DELETE /students/:id ──────────────────────────────
const removeStudent = (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id))
      return res.status(400).json({ success: false, message: "ID must be a number." });

    const deleted = deleteStudent(id);
    if (!deleted)
      return res.status(404).json({ success: false, message: `Student ${id} not found.` });

    res.json({ success: true, message: "Student deleted.", data: deleted });
  } catch (err) { next(err); }
};

module.exports = { getStudents, createStudent, editStudent, removeStudent };
