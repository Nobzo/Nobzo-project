const admin = require("../../firebase");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const express = require("express");
const router = express.Router();
const User = require("../../models/user"); 
module.exports = router;

// Google Login/Signup
router.post("/google", async (req, res) => {
    try {
      const { idToken } = req.body;
  
      // 1. Verify with Firebase
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name } = decodedToken;
  
      // Split displayName
      const [firstName, ...lastArr] = (name || "").split(" ");
      const lastName = lastArr.join(" ") || "";
  
      let user = await User.findOne({ email });
  
      if (!user) {
        user = await User.create({
          email,
          firstName,
          lastName,
          googleId: uid,
          role: "USER",
        });
      }
  
      // 3. Generate your JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.blog_jwtPrivateKey,
        { expiresIn: "1h" }
      );
  
      res.json({
        message: user.isNew ? "Signed up successfully" : "Logged in successfully",
        token,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Invalid Google token" });
    }
  });
  