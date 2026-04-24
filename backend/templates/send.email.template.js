exports.GenerateOTPTemplate = (otp, name) => {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; overflow: auto; line-height: 2">
    <div >
      <p style="font-size: 1.1em">Hi, ${name}</p>
      <p>Use the following OTP to complete your verification for ChitChat.</p>
      <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">
        ${otp}
      </h2>
      <p style="font-size: 0.9em;">Regards,<br />ChitChat Team</p>
    </div>
  </div>
  `;
};