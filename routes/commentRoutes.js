const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyAuthToken  = require('../middleware/auth');

router.post('/', verifyAuthToken, commentController.addComment);
router.delete('/:id', verifyAuthToken, commentController.deleteComment);
router.patch('/:id/hide', verifyAuthToken, commentController.hideComment);
router.patch('/:id/report', verifyAuthToken, commentController.reportComment);
router.get('/meme/:memeId', commentController.getComments);

module.exports = router;
