const express = require('express');
const router = express.Router();
const verifyAuthToken= require('../middleware/auth');
const likeController = require('../controllers/likeController');

router.post('/like', verifyAuthToken, likeController.likeMeme);
router.post('/unlike', verifyAuthToken, likeController.unlikeMeme);

module.exports = router;
