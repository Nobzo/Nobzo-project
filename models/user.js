const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

<<<<<<< HEAD
const userRoles = ["USER", "ADMIN"];
=======
const userRoles = ["USER", "ADMIN", "SUPERADMIN"];
>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
// user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
<<<<<<< HEAD
        required: true,
=======
        required: function() { return !this.googleId },
>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
<<<<<<< HEAD
        required: true,
        minLength: 3,
        maxLength: 50
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        minLength: 4,
        maxLength:50,
    },
=======
        required: function() { return !this.googleId },
        minLength: 3,
        maxLength: 50
    },
>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
    email: {
        type: String,
        required: true,
        minLength: 4,
        maxLength:255,
        unique: true
    },
    password: {
        type: String,
<<<<<<< HEAD
        required: true,
        minLength: 4,
        maxLength: 1024
    },
=======
        required: function() { return !this.googleId },
        minLength: 4,
        maxLength: 1024
    },
    googleId: { type: String }, 
>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
    role: {
        type: String,
        enum: userRoles,
        default: "USER"
    }
});

// token generation method
userSchema.methods.generateAuthToken = function (){

    const token =  jwt.sign(
        {_id: this._id, role: this.role}, // payload
        config.get("blog_jwtPrivateKey") // Secret private key
    ); 

    return token;
}

// mongoose user model with schema
const Users = mongoose.model("User", userSchema);


