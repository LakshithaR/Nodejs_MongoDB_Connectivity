//1. duplicate key error
//2. validation error
//3. cast error


// errorHandler.js

// Function to handle various types of errors


// const duplicate_key_error = (err, req, res, next) => {
//     if (err.code === 11000 || err.code === 11001) { // MongoDB duplicate key error codes
//         return res.status(ERROR_CODE).json({
//             success: false,
//             message: "Duplicate Key Error"
//         });
//     } else {
//         // Pass other errors to the default error handler
//         return next(err);
//     }
// }

// module.exports = duplicate_key_error;


// error_handler.js

// const errorHandler = (err, req, res, next) => {
//     let statusCode = 500;
//     let message = 'Internal Server Error';

//     if (err.code === 11000) { // Duplicate key error (MongoDB)
//         statusCode = 400;
//         message = 'Duplicate key error';
//     } else if (err.name === 'ValidationError') { // Validation error
//         statusCode = 422;
//         message = err.message;
//     } else if (err.name === 'CastError') { // Cast error (e.g., invalid ObjectID)
//         statusCode = 400;
//         message = 'Invalid ID';
//     }

//     res.status(statusCode).json({
//         success: false,
//         error: message
//     });
// };

// module.exports = errorHandler;


// error_handler.js

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err.code === 11000) { // Duplicate key error (MongoDB)
        statusCode = 400;
        message = 'Duplicate key error';
    } else if (err.name === 'ValidationError') { // Validation error
        statusCode = 422;
        message = err.message;
    } else if (err.name === 'CastError') { // Cast error (e.g., invalid ObjectID)
        statusCode = 400;
        message = 'Invalid ID';
    }

    // Set content type directly in the response
    // res.setHeader('Content-Type', 'application/json');

    return res.status(statusCode).json({
        success: false,
        error: {
            message: message,
            details: err // Include the error details for debugging purposes
        }
    });
};

module.exports = errorHandler;






