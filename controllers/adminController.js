import User from "../models/user.js";

export const updateUserRole = async (req, res) => {
    try {
      if (req.user.role !== "SUPERADMIN") {
        return res.status(403).json({ message: "Access denied" });
      }
  
      const {  role } = req.body;
  
      if (!["ADMIN", "SUPERADMIN", "USER"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      );
  
      res.json({ message: "User role updated", user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  