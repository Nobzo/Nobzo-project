const mongoose = require('mongoose');

const memeLikeSchema = new mongoose.Schema({
  memeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meme', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

memeLikeSchema.index({ memeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('MemeLike', memeLikeSchema);
