const express = require('express');
const router = express.Router();
const memeController = require('../controllers/memeController');
const categoryController = require('../controllers/categoryController');
const verifyAuthToken = require("../middleware/auth");
const authorizeRole = require("../middleware/admin");
const { logAction } = require("../middleware/activityLog");

router.get('/trending', verifyAuthToken, memeController.trendingMemes);
router.get('/feed', verifyAuthToken, memeController.getMemeFeed);
router.get('/', memeController.listMemes);
router.get('/pending', verifyAuthToken, authorizeRole("SUPERADMIN"), memeController.getUnreviewedMemes);
router.post('/', verifyAuthToken, authorizeRole("ADMIN"), logAction("Uploade_Meme", "MEME"), memeController.uploadMeme);
router.patch('/:id/review', verifyAuthToken,  authorizeRole("SUPERADMIN"), logAction("REVIEW", "MEME", (req) => {
    // detect whether approved or rejected from body
    return { decision: req.body.status }; 
  }), memeController.reviewMeme);
router.get('/:id', memeController.getMeme);
router.post('/categories', verifyAuthToken, authorizeRole("ADMIN"), logAction("Create_Category", "MEME"), categoryController.createCategory);
router.get('/categories/:categoryId/memes', categoryController.getMemesByCategory); 
module.exports = router;
