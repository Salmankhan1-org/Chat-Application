
const { body } = require('express-validator');

exports.LoginValidator = [
    // Email validation
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .toLowerCase(),

    // Password validation
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('captchaToken')
        .notEmpty()
        .withMessage('Password is required')
];
