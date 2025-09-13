const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const verifyAuthToken = require('../middleware/auth');
const authorizeRole = require('../middleware/admin');
const { logAction } = require("../middleware/activityLog");

router.get(
  '/',
  verifyAuthToken,
  authorizeRole('SUPERADMIN'),
  logAction("VIEW_ACTIVITY_LOGS", "ACTIVITY_LOG"),
  getActivityLogs
);

module.exports = router;
