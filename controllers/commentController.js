const Comment = require('../models/comment');
const buildCommentTree = require('../utilities/commentTree');

// Add a comment
const addComment = async (req, res) => {
  try {
    const { memeId, content, parentId } = req.body;

    const comment = new Comment({
      memeId,
      content,
      parentId: parentId || null,
      user: req.user._id
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (String(comment.user) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Hide a comment
const hideComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.hidden = true;
    await comment.save();

    res.json({ message: 'Comment hidden' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Report a comment
const reportComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.reported = true;
    await comment.save();

    res.json({ message: 'Comment reported' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get threaded comments for a meme
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ memeId: req.params.memeId }).lean();
    const tree = buildCommentTree(comments);
    res.json(tree);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addComment,
  deleteComment,
  hideComment,
  reportComment,
  getComments
};
