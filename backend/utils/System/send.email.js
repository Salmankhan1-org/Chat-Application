
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
});

/**
 * Sends an email using the shared transporter.
 */
exports.SendEmail = async ({ to, subject, html, text, from }) => {

  if (!to || !subject) {
    throw new Error("Email `to` and `subject` are required");
  }

  const mailOptions = {
    from: from || `"ChitChat Pvt. Ltd" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  };

  try {
        const info = await transporter.sendMail(mailOptions);
        
  } catch (error) {
        console.error("Email sending failed:", { error: error.message, to, subject });

        throw new Error("Failed to send email");
  }
};