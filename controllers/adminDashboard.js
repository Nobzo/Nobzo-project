// routes/admin.js
const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/auth");

// Admin dashboard route
router.get("/dashboard", authenticate, authorizeRoles("admin"), (req, res) => {
  res.send({
    message: "Welcome to the Admin Dashboard",
    user: req.user
  });
});

module.exports = router;
