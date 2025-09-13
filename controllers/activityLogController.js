import Log from "../models/log.js";

export const getActivityLogs = async (req, res) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const logs = await Log.find()
      .populate("userId", "username email")
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

