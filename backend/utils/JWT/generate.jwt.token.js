require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.generateToken = async (response, user, statusCode, message) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user?.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1d" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  };

  // Access Token (short-lived)
  response.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000
  });

  response.status(statusCode).json({
    statusCode:statusCode,
    success: true,
    error:[],
    message,
    data:user
  });
};
