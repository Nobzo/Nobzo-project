const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Define user roles
const userRoles = ["USER", "ADMIN", "SUPERADMIN"];

// User schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: function() { return !this.googleId; },
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: function() { return !this.googleId; },
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    age: {
        type: Number,
        required: false
    },
    gender: {
        type: String,
        minlength: 4,
        maxlength: 50,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 255,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: function() { return !this.googleId; },
        minlength: 4,
        maxlength: 1024
    },
    googleId: { type: String }, // for Google OAuth users
    role: {
        type: String,
        enum: userRoles,
        default: "USER"
    }
}, { timestamps: true });

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, role: this.role },
        process.env.JWT_KEY,   // read secret from environment variable
        { expiresIn: "1h" }    // token expires in 1 hour
    );
    return token;
};

// Create and export User model
const User = mongoose.model("User", userSchema);
module.exports = User;
