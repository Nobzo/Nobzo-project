const express = require('express');
const router = express.Router();
const { getGrowth, getUserActivity, getEngagement } = require ("../controllers/analyticsController.js");
const verifyAuthToken = require ("../middleware/auth.js");
const authorizeRole = require ("../middleware/admin.js");


// Only SUPERADMIN should see analytics
router.get("/growth", verifyAuthToken, authorizeRole("SUPERADMIN"), getGrowth);
router.get("/user-activity", verifyAuthToken, authorizeRole("SUPERADMIN"), getUserActivity);
router.get("/engagement", verifyAuthToken, authorizeRole("SUPERADMIN"), getEngagement);

module.exports = router;
