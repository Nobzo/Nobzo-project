const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
    media: {
        type: String,
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    hashtags: {
        type: [String],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", 
        required: true,
      },
    downloadCount: {
        type: Number,
        default: 0,
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'delete_pending', 'delete_rejected'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Meme', memeSchema);
