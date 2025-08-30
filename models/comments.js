const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    memeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meme',
        required: true,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isHidden: { type: Boolean, default: false }, // for hiding by non-authors
    reports: { type: Number, default: 0 }, // track reports
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
