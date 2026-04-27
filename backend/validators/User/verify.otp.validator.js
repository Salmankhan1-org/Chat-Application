
const { body } = require('express-validator');

exports.VerifyOTPValidator = [
    // Email validation
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .toLowerCase(),

    // OTP validation
    body('otp')
        .notEmpty()
        .withMessage('OTP is required')
        .isLength({ min: 6 })
        .withMessage('OTP must be at least 6 characters'),
];
