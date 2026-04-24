
const GlobalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 1. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    // Extract the field name that caused the conflict
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value detected: This ${field} is already in use. Please use another value.`;
    
    return res.status(400).json({
        success: false,
        statusCode: 400,
        error: [
            {
                field: field || 'popup',
                message: message
            }
        ],
        message: ''
    });
  }

  // 2. Mongoose Validation Error
  if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => ({
            field: val.path,
            message: val.message
        }));
        return res.status(400).json({
            success: false,
            statusCode: 400,
            error: messages
        });
    }

    // 3. Mongoose CastError (Invalid ID)
    if (err.name === 'CastError') {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            error: [
                { 
                    field: 'id', 
                    message: `Resource not found with id of ${err.value}` 
                }
            ],
            message: ''
        });
    }

    // Final Catch-all (Default)
    res.status(err.statusCode || 500).json({
            success: false,
            statusCode: err.statusCode || 500,
            error: [
                {
                    field: 'server',
                    message: err.message || 'Internal Server Error'
                }
            ],
            message: ''
    });
};

module.exports = GlobalErrorHandler;