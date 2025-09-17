const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const _ = require("lodash");
const crypto = require("crypto");
const Users = require("../models/user");
const verifyAuthToken = require("../middleware/auth");
const { validateUser, validateUpdateUser } = require("../utilities/utility");
const admin = require("../firebase.js");
const sendEmail = require("../utilities/emailService");


// Get current logged in user
router.get("/me", verifyAuthToken, async (req, res) => {
    try {
        // Get the users detail via it's id and exclude it's password
        const user = await Users.findById(req.user._id).select("-password");
        // send response
        res.send({
            message: "Success!",
            data: user
        })
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
        })
    }
})

//Retrieve all users
router.get("/allUsers", async (req, res) => {
    try {
        const users = await Users.find().select("-password");
        res.send({
            message: "Success!",
            data: users
        })
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
        })
    }
});

// Suspend a user
router.put("/suspend/:id", async (req, res) => {
    try {
        const suspendedUser = await Users.findByIdAndUpdate(
            req.params.id,
            { isSuspended: true },
            { new: true }
        );

        if (!suspendedUser) {
            return res.status(404).send("User not found!");
        }

        res.send({
            message: "User suspended successfully",
            data: suspendedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
        });
    }
});

// Delete a user
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await Users.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).send("User not found!");
        }

        res.send({
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
        });
    }
});

// Ban a user
router.put("/ban/:id", async (req, res) => {
    try {
        const bannedUser = await Users.findByIdAndUpdate(
            req.params.id,
            { isBanned: true },
            { new: true }
        );

        if (!bannedUser) {
            return res.status(404).send("User not found!");
        }

        res.send({
            message: "User banned successfully",
            data: bannedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
        });
    }
});

router.post("/", async (req, res) => {
    // validate incoming body
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send({
        message: "Oops! Failed to create user.",
        errorDetails: error.details[0].message,
      });
    }
  
    try {
      // Generate username automatically
      const baseUsername = req.body.firstName.toLowerCase();
      const randomSuffix = crypto.randomInt(1000, 9999);
      let username = `${baseUsername}_${randomSuffix}`;
  
      let existingUser = await Users.findOne({ username });
      while (existingUser) {
        const newSuffix = crypto.randomInt(1000, 9999);
        username = `${baseUsername}_${newSuffix}`;
        existingUser = await Users.findOne({ username });
      }
  
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      let newUser = new Users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        username: username,
      });
  
      await newUser.save();
  
      // Generate Firebase email verification link
      const verificationLink = await admin
        .auth()
        .generateEmailVerificationLink(req.body.email);
  
      // Send link via email
      await sendEmail({
        to: req.body.email,
        subject: "Verify your email - Nobzo",
        html: `
          <h1>Welcome to Nobzo 🎉</h1>
          <p>Hi ${req.body.firstName},</p>
          <p>Click below to verify your email address:</p>
          <a href="${verificationLink}">Verify Email</a>
        `,
      });
  
      res.send({
        message: "Success creating user! Verification email sent.",
        data: _.pick(newUser, [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          "username",
        ]),
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "An unexpected error occurred",
        details: err.message,
      });
    }
  });


// update a user
router.put("/:id", async (req, res) => {
    // validate incoming body
    if (!req.body.username || typeof req.body.username !== "string") {
        return res.status(400).send({
            message: "Oops! Failed to update user.",
            errorDetails: "Username is required and must be a string"
        });
    }

    try {
        // update ONLY the username
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            { username: req.body.username },
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).send("User not found!");
        }

        res.send({
            message: "Success updating username",
            data: _.pick(updatedUser, ["_id", "firstName", "lastName", "email", "username", "role"]) 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err.message
        });
    }
});



// Promote a user to admin or superadmin
// router.put("/:id/role", verifyAuthToken, async (req, res) => {
//     try {
//       // the person making the request
//       const requester = req.user;
  
//       if (requester.role !== "SUPERADMIN") {
//         return res.status(403).send("Access denied: Not a super admin!");
//       }
//      console.log(req.user);
//       const { role } = req.body;
  
//       if (!["ADMIN", "SUPERADMIN", "USER"].includes(role)) {
//         return res.status(400).json({ message: "Invalid role" });
//       }
  
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.id, // target user whose role we are updating
//         { role },
//         { new: true }
//       );
  
//       if (!updatedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       res.json({ message: "User role updated", user: updatedUser });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "An unexpected error occurred", details: err });
//     }
//   });
  



module.exports = router;