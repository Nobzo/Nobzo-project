// middleware/activityLog.js
const Log = require("../models/log");

function logAction(action, entity, getDetails = null) {
  return async (req, res, next) => {
    try {
      const details = getDetails ? getDetails(req) : null;

      await Log.create({
        userId: req.user?._id || null,
        role: req.user?.role || "guest",
        impact: details?.impact || "LOW",
        action,
        entity,
        entityId: req.params.id || null,
        details,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Log error:", err);
    }
    next();
  };
}

module.exports = { logAction };
