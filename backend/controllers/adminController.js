// backend/controllers/adminController.js
const db = require("../config/db");

// ✅ GET ALL USERS (include password)
exports.getUsers = (req, res) => {
  const sql = "SELECT * FROM users"; // include password column
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results); // results will include id, name, email, password
  });
};

// ✅ DELETE USER
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "User deleted" });
  });
};

// ✅ UPDATE USER
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  // hash password if provided
  const updateFields = [];
  const params = [];

  if (name) {
    updateFields.push("name = ?");
    params.push(name);
  }
  if (email) {
    updateFields.push("email = ?");
    params.push(email);
  }
  if (password) {
    const bcrypt = require("bcryptjs");
    const hashed = bcrypt.hashSync(password, 10);
    updateFields.push("password = ?");
    params.push(hashed);
  }

  if (updateFields.length === 0)
    return res.status(400).json({ message: "No fields to update" });

  params.push(id);

  const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "User updated" });
  });
};