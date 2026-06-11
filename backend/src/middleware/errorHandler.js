export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 400,
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  // Cast errors
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 400,
      message: 'Invalid ID format',
    });
  }

  // Duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 400,
      message: `${field} already exists`,
    });
  }

  res.status(status).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
