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
            age: req.body.age,
            gender: req.body.gender,
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
router.put("/:id", async (req, res)=>{
    // validate incoming body
    const { error } = validateUpdateUser(req.body);
    if(error){
        return res.status(400).send({
            message: "Oops! Failed to update user.",
            errorDetails: error.details[0].message
        })
    }

    try {
        // extract and update user data
        const updatedUser = await Users.findByIdAndUpdate(
            // user id
            req.params.id, 
            // updated data
            {
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                age : req.body.age,
                gender : req.body.gender,
                email: req.body.email,
                role: req.body.role
            },
            // return updated data instead of original data
            { 
                new: true
            }
        )

        // throw a 404 error if user was not found
        if(!updatedUser){
            return res.status(404).send("User not found!");
        }

        // send response
        res.send({
            message: "Success updating user",
            data: updatedUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "An unexpected error occurred",
            details: err
        })
    }
    
})

module.exports = router;