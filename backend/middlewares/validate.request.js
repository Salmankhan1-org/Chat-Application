
const { validationResult } = require('express-validator');

const ValidateRequest = (request, response, next) => {
    const errors = validationResult(request);
    
    if (!errors.isEmpty()) {
        return response.status(400).json({
            statusCode:400,
            success: false,
            message: 'Validation failed',
            error: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg,
                }))
            });
    }
    
    next();
};

module.exports = ValidateRequest;