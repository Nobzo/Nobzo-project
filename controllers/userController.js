const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Users({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await Users.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get current logged-in user
const getCurrentUser = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id).select("-password");
    res.json({ message: "Success!", data: user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().select("-password");
    res.json({ message: "Success!", data: users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await Users.findByIdAndDelete(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully", data: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Suspend user
const suspendUser = async (req, res) => {
  try {
    const suspendedUser = await Users.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true },
      { new: true }
    );

    if (!suspendedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User suspended successfully", data: suspendedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ban user
const banUser = async (req, res) => {
  try {
    const bannedUser = await Users.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    );

    if (!bannedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User banned successfully", data: bannedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  suspendUser,
  banUser
};
