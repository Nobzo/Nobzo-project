const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const verifyAuthToken = require("../middleware/auth");

// Like or Unlike a post (toggle)
router.post("/:postId", verifyAuthToken, async (req, res) => {
    try {
        const existingLike = await Like.findOne({ postId: req.params.postId, userId: req.user._id });
        if (existingLike) {
            await existingLike.deleteOne();
            return res.status(200).send({ message: "Post unliked" });
        }

        const like = new Like({ postId: req.params.postId, userId: req.user._id });
        await like.save();
        res.status(201).send({ message: "Post liked", data: like });
    } catch (err) {
        res.status(500).send({ message: "Error liking post", details: err.message });
    }
});

// Get total likes count
router.get("/:postId", async (req, res) => {
    try {
        const count = await Like.countDocuments({ postId: req.params.postId });
        res.status(200).send({ message: "Likes count retrieved", count });
    } catch (err) {
        res.status(500).send({ message: "Error fetching likes count", details: err.message });
    }
});

// Get users who liked a post
router.get("/users/:postId", async (req, res) => {
    try {
        const likes = await Like.find({ postId: req.params.postId })
            .populate("userId", "firstName lastName email");

        res.status(200).send({ message: "Users who liked post retrieved", data: likes });
    } catch (err) {
        res.status(500).send({ message: "Error fetching users", details: err.message });
    }
});

module.exports = router;
