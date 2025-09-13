const express = require("express");
const router = express.Router();
const Blacklist = require("../models/blackList");


router.post("/", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) return res.status(400).send({ message: "No token provided" });
  
    try {
      // Blacklist JWT (your app logout)
      await Blacklist.create({ token });
    
      res.send({ message: "Logout successful" });
    } catch (err) {
      res.status(500).send({ message: "Logout failed", details: err.message });
    }
  });

module.exports = router;