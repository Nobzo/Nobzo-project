const { sendPasswordReset } = require("../../utilities/resetPassword");

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await sendPasswordReset(email);

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { resetPassword };
