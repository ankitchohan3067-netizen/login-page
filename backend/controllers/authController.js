// backend/controllers/authController.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN (auto-register new user if not exists)
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Please fill all fields" });

  const sqlSelect = "SELECT * FROM users WHERE email = ?";
  db.query(sqlSelect, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    if (results.length === 0) {
      // User not exists → create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const sqlInsert = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(sqlInsert, [email.split("@")[0], email, hashedPassword], (err2, result) => {
        if (err2) return res.status(500).json({ message: err2.message });

        const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
        return res.json({ message: "New user created and logged in", token, user: { id: result.insertId, email } });
      });
    } else {
      // User exists → check password
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
      return res.json({ message: "Login successful", token, user: { id: user.id, email: user.email } });
    }
  });
};