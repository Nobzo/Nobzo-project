const express = require("express");
const router = express.Router();
const Comment = require("../models/Comments");
const verifyAuthToken = require("../middleware/auth");
const { validateComment } = require("../utilities/utility");

// Add a comment
router.post("/:postId", verifyAuthToken, async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return res.status(400).send({ message: "Invalid comment data", errorDetails: error.details[0].message });

    try {
        const { content } = req.body;
        const comment = new Comment({ postId: req.params.postId, userId: req.user._id, content });
        await comment.save();
        res.send({ message: "Comment added", data: comment });
    } catch (err) {
        res.status(500).send({ message: "Error adding comment", details: err });
    }
});

// Get comments for a post
router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate("userId", "firstName lastName email");
        res.send({ message: "Comments retrieved", data: comments });
    } catch (err) {
        res.status(500).send({ message: "Error fetching comments", details: err });
    }
});

module.exports = router;
