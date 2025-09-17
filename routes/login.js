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
        const foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser)
            return res.status(400).send({ message: "Invalid email or password!" });

        const validPassword = await bcrypt.compare(req.body.password, foundUser.password);
        if (!validPassword)
            return res.status(400).send({ message: "Invalid email or password!" });

        // Generate JWT token
        const token = foundUser.generateAuthToken();

        res.send({
            message: "Successfully Logged in!",
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: error.message
        });
    }
});

module.exports = router;
