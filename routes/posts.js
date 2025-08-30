const express = require("express");
const router = express.Router();
const Post = require("../models/Posts");
const verifyAuthToken = require("../middleware/auth");
const { validatePost } = require("../utilities/utility");

// Create a post
router.post("/", verifyAuthToken, async (req, res) => {
    // Validate input
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send({ message: "Invalid post data", errorDetails: error.details[0].message });

    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content, author: req.user._id });
        await newPost.save();
        res.send({ message: "Post created successfully", data: newPost });
    } catch (err) {
        res.status(500).send({ message: "Error creating post", details: err });
    }
});

// Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "firstName lastName email");
        res.send({ message: "Posts retrieved", data: posts });
    } catch (err) {
        res.status(500).send({ message: "Error fetching posts", details: err });
    }
});

// Get single post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "firstName lastName email");
        if (!post) return res.status(404).send({ message: "Post not found" });
        res.send({ message: "Post retrieved", data: post });
    } catch (err) {
        res.status(500).send({ message: "Error fetching post", details: err });
    }
});

// Update post
router.put("/:id", verifyAuthToken, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send({ message: "Invalid post data", errorDetails: error.details[0].message });

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });
        if (post.author.toString() !== req.user._id) return res.status(403).send({ message: "Unauthorized" });

        post.title = req.body.title;
        post.content = req.body.content;
        await post.save();

        res.send({ message: "Post updated successfully", data: post });
    } catch (err) {
        res.status(500).send({ message: "Error updating post", details: err });
    }
});

// Delete post
router.delete("/:id", verifyAuthToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send({ message: "Post not found" });
        if (post.author.toString() !== req.user._id) return res.status(403).send({ message: "Unauthorized" });

        await post.remove();
        res.send({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: "Error deleting post", details: err });
    }
});

module.exports = router;
