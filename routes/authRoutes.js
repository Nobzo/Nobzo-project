const express = require("express");
const { verifyEmail } = require("../controllers/Auth/emailVerification");
const { resetPassword } = require("../controllers/Auth/passwordRecovery");

const router = express.Router();

router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);

module.exports = router;
