const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userRoles = ["USER", "ADMIN", "SUPERADMIN"];
// user schema
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
    email: {
        type: String,
        required: true,
        minLength: 4,
        maxLength:255,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: function() { return !this.googleId },
        minLength: 3,
        maxLength: 50,
        unique: true
    },
    notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true }
      },
    password: {
        type: String,
        required: function() { return !this.googleId },
        minLength: 4,
        maxLength: 1024
    },
    googleId: { type: String }, 
    role: {
        type: String,
        enum: userRoles,
        default: "USER"
    },
    likedMemes: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: "Meme" 
        }
    ],
    commentedMemes: [
        { 
            type: mongoose.Schema.Types.ObjectId, ref: "Meme" 
        }
    ],
    watchHistory: [
        {
    memeId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "Meme" 
    },
    watchTime: Number 
  }
],
  favoriteTags: [String] 
});

// token generation method
userSchema.methods.generateAuthToken = function (){

    const token =  jwt.sign(
        {_id: this._id, role: this.role}, // Payload data
        config.get("blog_jwtPrivateKey") // Secret private key
    ); 

    return token;
}

// mongoose user model with schema
const Users = mongoose.model("User", userSchema);


module.exports = Users;