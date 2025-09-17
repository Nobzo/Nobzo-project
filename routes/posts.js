const express = require("express");
const router = express.Router();
const Post = require("../models/Posts");
const verifyAuthToken = require("../middleware/auth");
const { validatePost } = require("../utilities/utility");

// ------------------ CREATE POST ------------------
router.post("/", verifyAuthToken, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error)
        return res.status(400).send({
            status: "error",
            message: "Invalid post data",
            errorDetails: error.details[0].message
        });

    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content, author: req.user._id });
        await newPost.save();
        res.status(201).send({
            status: "success",
            message: "Post created successfully",
            data: newPost
        });
    } catch (err) {
        res.status(500).send({
            status: "error",
            message: "Error creating post",
            details: err.message
        });
    }
});

// ------------------ GET ALL POSTS ------------------
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "firstName lastName email");
        res.status(200).send({ status: "success", message: "Posts retrieved", data: posts });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Error fetching posts", details: err.message });
    }
});

// ------------------ GET SINGLE POST ------------------
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "firstName lastName email");
        if (!post) return res.status(404).send({ status: "error", message: "Post not found" });
        res.status(200).send({ status: "success", message: "Post retrieved", data: post });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Error fetching post", details: err.message });
    }
});

// ------------------ UPDATE POST ------------------
router.put("/:id", verifyAuthToken, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error)
        return res.status(400).send({
            status: "error",
            message: "Invalid post data",
            errorDetails: error.details[0].message
        });

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ status: "error", message: "Post not found" });
        if (post.author.toString() !== req.user._id)
            return res.status(403).send({ status: "error", message: "Unauthorized" });

        post.title = req.body.title;
        post.content = req.body.content;
        await post.save();

        res.status(200).send({ status: "success", message: "Post updated successfully", data: post });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Error updating post", details: err.message });
    }
});

// ------------------ DELETE POST ------------------
router.delete("/:id", verifyAuthToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ status: "error", message: "Post not found" });
        if (post.author.toString() !== req.user._id)
            return res.status(403).send({ status: "error", message: "Unauthorized" });

        await post.remove();
        res.status(200).send({ status: "success", message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Error deleting post", details: err.message });
    }
});

// ------------------ LIKE POST ------------------
router.post("/:id/like", verifyAuthToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ status: "error", message: "Post not found" });

        if (post.likes.includes(req.user._id)) {
            return res.status(400).send({ status: "error", message: "You already liked this post" });
        }

        post.likes.push(req.user._id);
        await post.save();

        res.status(200).send({ status: "success", message: "Post liked", likes: post.likes.length });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Error liking post", details: err.message });
    }
});

// ------------------ COMMENT ON POST ------------------
router.post("/:id/comment", verifyAuthToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ status: "error", message: "Post not found" });

        if (!req.body.text) {
            return res.status(400).send({ status: "error", message: "Comment text is required" });
        }

        const comment = {
            user: req.user._id,
            text: req.body.text,
            date: new Date()
        };

        post.comments.push(comment);
        await post.save();

        res.status(200).send({ status: "success", message: "Comment added", comments: post.comments });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Error adding comment", details: err.message });
    }
});

module.exports = router;
