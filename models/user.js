const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

// User roles
const userRoles = ["USER", "ADMIN", "SUPERADMIN"];

// User schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: function() { return !this.googleId },
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: function() { return !this.googleId },
        minLength: 3,
        maxLength: 50
    },
    age: {
        type: Number,
        required: false // optional if using Google OAuth
    },
    gender: {
        type: String,
        minLength: 4,
        maxLength: 50,
        required: false
    },
    email: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId },
        minLength: 4,
        maxLength: 1024
    },
    googleId: { type: String }, // for Google OAuth users
    role: {
        type: String,
        enum: userRoles,
        default: "USER"
    }
});

// Token generation method
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, role: this.role }, // payload
        config.get("blog_jwtPrivateKey")   // secret private key
    );
    return token;
};

// Mongoose User model
const Users = mongoose.model("User", userSchema);

module.exports = Users;



