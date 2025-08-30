const Meme = require('../models/memes');
const MemeLike = require('../models/memeLike');

exports.likeMeme = async (req, res) => {
  try {
    const { memeId } = req.body;
    const userId = req.user._id;

    // Try insert like (unique index enforces single like)
    await MemeLike.create({ memeId, userId });

    // Inc likeCount
    const meme = await Meme.findByIdAndUpdate(
      memeId, { $inc: { likeCount: 1 } }, { new: true, projection: { likeCount: 1 } }
    ).lean();

    const io = req.app.get('io');
    io.to(`meme:${memeId}`).emit('meme:like_updated', { memeId, likeCount: meme.likeCount });

    res.status(201).json({ memeId, likeCount: meme.likeCount });
  } catch (err) {
    // E11000 = already liked
    if (err && err.code === 11000) return res.status(200).json({ message: 'Already liked' });
    res.status(400).json({ error: err.message });
  }
};

exports.unlikeMeme = async (req, res) => {
  try {
    const { memeId } = req.body;
    const userId = req.user._id;

    const del = await MemeLike.findOneAndDelete({ memeId, userId });
    if (!del) return res.status(200).json({ message: 'Not liked' });

    const meme = await Meme.findByIdAndUpdate(
      memeId, { $inc: { likeCount: -1 } }, { new: true, projection: { likeCount: 1 } }
    ).lean();

    const io = req.app.get('io');
    io.to(`meme:${memeId}`).emit('meme:like_updated', { memeId, likeCount: meme.likeCount });

    res.json({ memeId, likeCount: meme.likeCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
