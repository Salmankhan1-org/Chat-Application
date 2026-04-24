const { body } = require("express-validator");

exports.CreateNewUserValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters")
        .matches(/^[a-zA-Z0-9_ .!@#$%^&*()-+=]+$/)
        .withMessage("Username can contain letters, numbers, spaces and common special characters"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[@$!%*?&#]/).withMessage("Password must contain at least one special character"),

    body("bio")
        .optional()
        .trim()
        .isLength({ max: 160 }).withMessage("Bio cannot exceed 160 characters"),
]