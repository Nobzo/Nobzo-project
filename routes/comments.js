const express = require("express");
const router = express.Router();
const Comment = require("../models/Comments"); // ✅ singular
const verifyAuthToken = require("../middleware/auth");

// Add a comment
router.post("/:memeId", verifyAuthToken, async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send({ message: "Comment text is required" });
    }

    try {
        const comment = new Comment({
            memeId: req.params.memeId,   // ✅ match schema
            author: req.user._id,        // from JWT
            text: text
        });

        await comment.save();
        res.status(201).send({ message: "Comment added", data: comment });
    } catch (err) {
        res.status(500).send({ message: "Error adding comment", details: err });
    }
});

// Get all comments for a meme
router.get("/:memeId", async (req, res) => {
    try {
        const comments = await Comment.find({ memeId: req.params.memeId })
            .populate("author", "firstName lastName email"); // ✅ show user info

        res.status(200).send({ message: "Comments retrieved", data: comments });
    } catch (err) {
        res.status(500).send({ message: "Error fetching comments", details: err });
    }
});

module.exports = router;
