const express = require("express");
const router = express.Router();

// Example login route
router.post("/login", (req, res) => {
    res.send("Login route works!");
});

// You can add more auth routes here (register, Google OAuth, etc.)

module.exports = router;
