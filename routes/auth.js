const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { validateLogin } = require("../utilities/utility");
const User = require("../models/user");

// POST /api/auth/login
router.post("/login", async (req, res) => {
    // Validate incoming body
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).send({
            message: "Oops! Failed to login user.",
            errorDetails: error.details[0].message
        });
    }

    try {
        // Check if user exists
        const foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser)
            return res.status(400).send({ message: "Invalid email or password!" });

        // Compare password
        const validPassword = await bcrypt.compare(req.body.password, foundUser.password);
        if (!validPassword)
            return res.status(400).send({ message: "Invalid email or password!" });

        // Generate JWT token
        const token = foundUser.generateAuthToken();

        // Send token in response
        res.send({
            message: "Successfully logged in!",
            token: token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err.message
        });
    }
});

module.exports = router;
