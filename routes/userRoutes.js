const express = require("express");
const router = express.Router();
const verifyAuthToken = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  suspendUser,
  banUser,
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user (protected)
router.get("/me", verifyAuthToken, getCurrentUser);

// Get all users
router.get("/", getAllUsers);

// Suspend user
router.put("/suspend/:id", suspendUser);

// Ban user
router.put("/ban/:id", banUser);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
