// =====================================================
// models/userModel.js
// In-memory user store + helper functions
// =====================================================

// Initial users (default admin)
const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

/**
 * Find user by email (case-insensitive)
 */
const findUserByEmail = (email) =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());

/**
 * Add a new user
 */
const addUser = (user) => {
  users.push(user);
};

/**
 * Get all users (optional)
 */
const getAllUsers = () => users;

module.exports = {
  users,
  findUserByEmail,
  addUser,
  getAllUsers,
};