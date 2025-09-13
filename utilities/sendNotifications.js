const nodemailer = require("nodemailer");
const axios = require("axios"); // for push service (e.g., Firebase Cloud Messaging)

// Example: setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or any email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send notification based on user preferences
 * @param {Object} user - The user object from DB
 * @param {String} title - Notification title
 * @param {String} message - Notification body
 */
async function sendNotification(user, title, message) {
  try {
    // 1. In-App Notification
    if (user.notifications?.inApp) {
      // Save notification in DB
      await Notification.create({
        userId: user._id,
        title,
        message,
        read: false,
        createdAt: new Date(),
      });
    }

    // 2. Email Notification
    if (user.notifications?.email) {
      await transporter.sendMail({
        from: `"MyApp Notifications" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: title,
        text: message,
      });
    }

    // 3. Push Notification
    if (user.notifications?.push && user.deviceToken) {
      // Example: Send via Firebase Cloud Messaging (FCM)
      await axios.post(
        "https://fcm.googleapis.com/fcm/send",
        {
          to: user.deviceToken,
          notification: {
            title,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `key=${process.env.FCM_SERVER_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Notification sent according to preferences");
  } catch (err) {
    console.error("Error sending notification:", err.message);
  }
}

module.exports = sendNotification;
