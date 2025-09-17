const admin = require("../../firebase");
const sendEmail = require("../../utilities/emailService");

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const link = await admin.auth().generateEmailVerificationLink(email);

    await sendEmail({
      to: email,
      subject: "Verify your email - Nobzo",
      html: `<a href="${link}">Verify Email</a>`,
    });

    res.json({ message: "Verification email sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { verifyEmail };
