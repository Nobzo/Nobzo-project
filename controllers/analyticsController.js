import User from "../models/user.js";
import Log from "../models/log.js";

/**
 * @desc Get platform growth (new users per period)
 * @route GET /api/analytics/growth?range=30
 */
export const getGrowth = async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const newUsers = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ range: `${range}d`, newUsers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * @desc Get user activity trends (registrations + logins)
 * @route GET /api/analytics/user-activity?range=7
 */
export const getUserActivity = async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const registrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const logins = await Log.aggregate([
      { $match: { action: "LOGIN", timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ range: `${range}d`, registrations, logins });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * @desc Get user engagement (avg session duration per day)
 * @route GET /api/analytics/engagement?range=30
 */
export const getEngagement = async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const engagement = await Log.aggregate([
      {
        $match: {
          action: "SESSION_END",
          timestamp: { $gte: startDate },
          "details.sessionDuration": { $exists: true }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          avgDuration: { $avg: "$details.sessionDuration" } // in seconds
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      range: `${range}d`,
      avgSessionDuration: engagement.map(e => ({
        date: e._id,
        minutes: parseFloat((e.avgDuration / 60).toFixed(1)) // convert to minutes
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
