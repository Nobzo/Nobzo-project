const Meme = require('../models/memes');

// Admin upload meme
exports.uploadMeme = async (req, res) => {
    try {
        const meme = await Meme.create({
            ...req.body,
            author: req.user._id, // comes from auth middleware
            status: 'pending'
        });
        res.status(201).json(meme);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Superadmin approve/reject meme
exports.reviewMeme = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'delete_pending', 'delete_rejected'].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const meme = await Meme.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(meme);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Public fetch meme (increment view count in realtime)
exports.getMeme = async (req, res) => {
    try {
        const meme = await Meme.findByIdAndUpdate(
            req.params.id,
            { $inc: { viewCount: 1 } },
            { new: true }
        );
        res.json(meme);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// GET approved memes (paginated)
exports.listMemes = async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 20);
      const skip = (page - 1) * limit;
  
      const [items, total] = await Promise.all([
        Meme.find({ status: 'approved' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Meme.countDocuments({ status: 'approved' })
      ]);
  
      res.json({ items, page, limit, total });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

exports.reviewMeme = async (req, res) => {
    try {
      const { status } = req.body;
      const allowed = ['approved', 'rejected', 'delete_pending', 'delete_rejected'];
      if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  
      const meme = await Meme.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
      const io = req.app.get('io');
      io.to(`meme:${meme._id}`).emit('meme:status_changed', { memeId: meme._id, status: meme.status });
  
      res.json(meme);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };