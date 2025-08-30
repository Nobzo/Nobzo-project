const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyAuthToken = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.blog_jwtPrivateKey);

        
        console.log("JWT Payload:", decoded);

        // fetch the full user
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized. No user found in request." });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
        res.status(400).json({ message: "Invalid token", details: err });
    }
};

module.exports = verifyAuthToken;
