import { ApiError } from '../utils/apiError.js';

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(422).json({
      success: false,
      message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
