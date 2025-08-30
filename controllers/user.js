const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const _ = require("lodash");
// model
const Users = require("../models/user");
// middleware
const verifyAuthToken = require("../middleware/auth");
// helper utilities
const { validateUser, validateUpdateUser } = require("../utilities/utility");


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

// Create a user
router.post("/", async (req, res) => {
    // validate incoming body
    const { error } = validateUser(req.body);
    if(error){
        return res.status(400).send({
            message: "Oops! Failed to create user.",
            errorDetails: error.details[0].message
        })
    }

    try {
         // create new profile instance
        let newUser = new Users({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })

        // Hash password using bcrypt
        newUser.password = await bcrypt.hash(req.body.password, 10);

        // save new user in database
        await newUser.save();

        // send response
        res.send({
            message: "Success creating user!",
            data: _.pick(newUser, ["_id","firstName","lastName","email","role"])
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
        })
    }
   
})

// update a user
router.put("/:id", async (req, res) => {
    // validate incoming body
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).send({
            message: "Oops! Failed to update user.",
            errorDetails: error.details[0].message
        });
    }

    try {
        // only update safe fields (no role here)
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                gender: req.body.gender,
                email: req.body.email
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User not found!");
        }

        res.send({
            message: "Success updating user",
            data: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
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