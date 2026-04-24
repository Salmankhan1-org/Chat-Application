// middlewares/sanitizeRequest.js

const { validationResult, matchedData } = require('express-validator');
const xss = require('xss');

const sanitize = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => sanitize(item));
    }

    if (data !== null && typeof data === 'object') {
        const sanitizedObj = {};
        for (const key in data) {
            sanitizedObj[key] = sanitize(data[key]);
        }
        return sanitizedObj;
    }

    if (typeof data === 'string') {
        return xss(data.trim());
    }

    return data;
};


const SanitizeRequest = (request, response, next) => {
    try {
       
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Validation failed',
                error: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg,
                }))
            });
        }

      
        const validatedData = matchedData(request, {
            locations: ['body', 'query', 'params'],
            includeOptionals: true
        });

       
        // If no validated fields → fallback to raw request
        const hasValidatedData = Object.keys(validatedData).length > 0;

        const finalBody = hasValidatedData ? validatedData : request.body;
        const finalQuery = hasValidatedData ? validatedData : request.query;
        const finalParams = hasValidatedData ? validatedData : request.params;

      
        request.body = sanitize(finalBody);
        request.query = sanitize(finalQuery);
        request.params = sanitize(finalParams);

        next();

    } catch (error) {
      

        return response.status(500).json({
            statusCode:500,
            success: false,
            error:[
                {
                    field: 'server',
                    message: error?.message || 'Internal sanitization error'
                }
            ],
            message:''
        });
    }
};

module.exports = SanitizeRequest;