import admin from "../firebase.js";
import sendEmail from "./emailService.js";

export async function sendPasswordReset(userEmail) {
  const link = await admin.auth().generatePasswordResetLink(userEmail);

  // Send via your email service
  await sendEmail({
    to: userEmail,
    subject: "Reset your Nobzo password",
    html: `
      <p>Click below to reset your password:</p>
      <a href="${link}">Reset Password</a>
    `,
  });

  return link;
}
