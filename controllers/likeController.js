const Meme = require('../models/memes');
const MemeLike = require('../models/memeLike');

exports.toggleLike = async (req, res) => {
  try {
    const { memeId } = req.body;
    const userId = req.user._id;

    // Check if user already liked
    const existing = await MemeLike.findOne({ memeId, userId });

    let meme, action;

    if (existing) {
      // Unlike: remove the record, decrement likeCount
      await existing.deleteOne();
      meme = await Meme.findByIdAndUpdate(
        memeId,
        { $inc: { likeCount: -1 } },
        { new: true, projection: { likeCount: 1 } }
      ).lean();
      action = "unliked";
    } else {
      // Like: create the record, increment likeCount
      await MemeLike.create({ memeId, userId });
      meme = await Meme.findByIdAndUpdate(
        memeId,
        { $inc: { likeCount: 1 } },
        { new: true, projection: { likeCount: 1 } }
      ).lean();
      action = "liked";
    }

    const io = req.app.get('io');
    io.to(`meme:${memeId}`).emit('meme:like_updated', {
      memeId,
      likeCount: meme.likeCount,
    });

    res.json({ memeId, likeCount: meme.likeCount, action });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
