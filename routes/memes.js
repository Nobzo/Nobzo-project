const express = require("express");
const router = express.Router();
const Meme = require("../models/Meme");
const verifyAuthToken = require("../middleware/auth");

// Upload a meme
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // folder to store uploaded memes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage });

// Admin uploads meme
router.post("/upload", verifyAuthToken, upload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
        const imageUrl = req.file.path;

        const meme = new Meme({ title, imageUrl });
        await meme.save();
        res.send({ message: "Meme uploaded successfully", data: meme });
    } catch (err) {
        res.status(500).send({ message: "Error uploading meme", details: err });
    }
});

// Get memes feed (first meme first)
router.get("/feed", verifyAuthToken, async (req, res) => {
    try {
        const memes = await Meme.find().sort({ createdAt: -1 }); // newest first
        res.send({ message: "Meme feed retrieved", data: memes });
    } catch (err) {
        res.status(500).send({ message: "Error fetching meme feed", details: err });
    }
});

// Increment meme views
router.post("/view/:memeId", async (req, res) => {
    try {
        const meme = await Meme.findById(req.params.memeId);
        if (!meme) return res.status(404).send({ message: "Meme not found" });

        meme.views += 1;
        await meme.save();
        res.send({ message: "Meme viewed", data: meme });
    } catch (err) {
        res.status(500).send({ message: "Error updating views", details: err });
    }
});

// Download meme
router.get("/download/:memeId", async (req, res) => {
    try {
        const meme = await Meme.findById(req.params.memeId);
        if (!meme) return res.status(404).send({ message: "Meme not found" });

        res.download(meme.imageUrl); // send file to user
    } catch (err) {
        res.status(500).send({ message: "Error downloading meme", details: err });
    }
});

module.exports = router;
