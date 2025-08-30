const express = require('express');
const router = express.Router();
const memeController = require('../controllers/memeController');
const verifyAuthToken = require("../middleware/auth");
const authorizeRole = require("../middleware/admin");

router.get('/', memeController.listMemes);
router.post('/', verifyAuthToken, authorizeRole("ADMIN"), memeController.uploadMeme);
router.patch('/:id/review', verifyAuthToken, authorizeRole("superAdmin"), memeController.reviewMeme);
router.get('/:id', memeController.getMeme);

module.exports = router;
