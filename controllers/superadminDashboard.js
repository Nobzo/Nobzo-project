// routes/superadmin.js
const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/auth");

// SuperAdmin dashboard route
router.get("/dashboard", authenticate, authorizeRoles("superadmin"), (req, res) => {
  res.send({
    message: "Welcome to the SuperAdmin Dashboard",
    user: req.user
  });
});

module.exports = router;
