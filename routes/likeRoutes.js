const express = require('express');
const router = express.Router();
const verifyAuthToken= require('../middleware/auth');
const likeController = require('../controllers/likeController');

router.post('/toggleLike', verifyAuthToken, likeController.toggleLike);

module.exports = router;
