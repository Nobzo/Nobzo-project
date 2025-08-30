const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 255 },
    content: { type: String, required: true, minlength: 1 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Posts", postSchema);

