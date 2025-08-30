const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const verifyAuthToken = require("../middleware/auth");

// Like or Unlike a post (toggle)
router.post("/:postId", verifyAuthToken, async (req, res) => {
    try {
        // Check if user already liked the post
        const existingLike = await Like.findOne({ postId: req.params.postId, userId: req.user._id });
        if (existingLike) {
            // If liked, remove it (unlike)
            await existingLike.remove();
            return res.send({ message: "Post unliked" });
        }

        // Else, create a new like
        const like = new Like({ postId: req.params.postId, userId: req.user._id });
        await like.save();
        res.send({ message: "Post liked", data: like });
    } catch (err) {
        res.status(500).send({ message: "Error liking post", details: err });
    }
});

// Get total likes count for a post
router.get("/:postId", async (req, res) => {
    try {
        const count = await Like.countDocuments({ postId: req.params.postId });
        res.send({ message: "Likes count retrieved", count });
    } catch (err) {
        res.status(500).send({ message: "Error fetching likes count", details: err });
    }
});

// Optional: Get list of users who liked a post
router.get("/users/:postId", async (req, res) => {
    try {
        const likes = await Like.find({ postId: req.params.postId }).populate("userId", "firstName lastName email");
        res.send({ message: "Users who liked post retrieved", data: likes });
    } catch (err) {
        res.status(500).send({ message: "Error fetching users", details: err });
    }
});

module.exports = router;
