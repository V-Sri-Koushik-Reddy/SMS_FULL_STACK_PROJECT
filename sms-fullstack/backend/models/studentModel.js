// =====================================================
// models/studentModel.js
// In-memory student data store
// =====================================================

let students = [
  { id: 1, name: "Alice Johnson", rollNo: "CS101", marks: 88 },
  { id: 2, name: "Bob Smith",     rollNo: "CS102", marks: 73 },
  { id: 3, name: "Carol White",   rollNo: "CS103", marks: 95 },
  { id: 4, name: "David Brown",   rollNo: "CS104", marks: 60 },
  { id: 5, name: "Eva Green",     rollNo: "CS105", marks: 82 },
];

let nextId = 6;

const getAllStudents   = ()          => students;
const findById        = (id)        => students.find((s) => s.id === id);
const searchByName    = (q)         => students.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
const filterByMarks   = (min)       => students.filter((s) => s.marks > min);

const addStudent = (name, rollNo, marks) => {
  const s = { id: nextId++, name, rollNo, marks };
  students.push(s);
  return s;
};

const updateStudent = (id, updates) => {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  students[idx] = { ...students[idx], ...updates };
  return students[idx];
};

const deleteStudent = (id) => {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const [del] = students.splice(idx, 1);
  return del;
};

module.exports = {
  getAllStudents, findById, searchByName,
  filterByMarks, addStudent, updateStudent, deleteStudent,
};
