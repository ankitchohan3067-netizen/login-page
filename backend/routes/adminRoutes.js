const express = require("express");
const router = express.Router();
const { getUsers, deleteUser, updateUser } = require("../controllers/adminController");

// ✅ Admin routes
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

module.exports = router;