const Meme = require('../models/memes');
const User = require('../models/user');
// import Category from "../models/category.js";

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

// Get trending memes (score = engagement / time-decay)
exports.trendingMemes = async (req, res) => {
    try {
      const memes = await Meme.aggregate([
        {
          $match: { status: 'approved' }
        },
        {
          $addFields: {
            hoursSincePost: {
              $divide: [
                { $subtract: [new Date(), "$createdAt"] },
                1000 * 60 * 60  // ms -> hours
              ]
            },
            engagement: {
              $add: [
                { $multiply: ["$likeCount", 2] },
                { $multiply: ["$commentCount", 3] },
                { $multiply: ["$downloadCount", 4] }, // optional weight
                { $multiply: ["$viewCount", 0.5] }   // optional lower weight
              ]
            }
          }
        },
        {
          $addFields: {
            score: {
              $divide: [
                "$engagement",
                { $pow: [{ $add: ["$hoursSincePost", 2] }, 1.5] }
              ]
            }
          }
        },
        { $sort: { score: -1 } },
        { $limit: 20 }
      ]);
  
      res.json(memes);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
/**
 * @desc    Get memes feed (For You or by category)
 * @route   GET /api/memes/feed
 * @query   categoryId (optional), lastId (optional), limit (optional)
 * @access  Public
 */
exports.getMemeFeed = async (req, res) => {
  try {
    const { categoryId, lastId, limit = 10 } = req.query;

    const query = {};

    // Filter by category if provided
    if (categoryId) {
      query.category = categoryId;
    }

    // For infinite scroll (fetch memes "after" the lastId)
    if (lastId) {
      query._id = { $lt: lastId }; // use $lt since ObjectIds grow with time
    }

    const memes = await Meme.find(query)
      .populate("category", "name")
      .populate("author", "username")
      .sort({ _id: -1 }) // newest first
      .limit(parseInt(limit));

    res.json({
      memes,
      hasMore: memes.length === parseInt(limit), // tells frontend if there might be more
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Server error" });
  }
};


  
  /**
 * @desc    Get all unreviewed memes (status: pending)
 * @route   GET /api/memes/pending
 * @access  Admin/Moderator
 */
// controllers/memeController.js
exports.getUnreviewedMemes = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;   // default page 1
      const limit = parseInt(req.query.limit) || 20; // default 20 memes per page
      const skip = (page - 1) * limit;
  
      const memes = await Meme.find({ status: "pending" })
        .populate("category", "name")
        .populate("author", "username email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // newest first
  
      const total = await Meme.countDocuments({ status: "pending" });
  
      res.status(200).json({
        page,
        totalPages: Math.ceil(total / limit),
        totalMemes: total,
        memes,
      });
    } catch (error) {
      console.error("Error fetching unreviewed memes:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  