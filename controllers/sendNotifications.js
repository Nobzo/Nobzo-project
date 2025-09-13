router.put("/:id/notifications", async (req, res) => {
    try {
      const { email, push, inApp } = req.body; 
  
      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        { notifications: { email, push, inApp } },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).send({ message: "User not found!" });
      }
  
      res.send({
        message: "Notification preferences updated",
        preferences: updatedUser.notifications
      });
    } catch (err) {
      res.status(500).send({ message: "Failed to update notifications", details: err.message });
    }
  });
  