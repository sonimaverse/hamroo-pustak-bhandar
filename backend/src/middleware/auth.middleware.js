import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
import { ApiError } from '../utils/apiError.js';
import { findById } from '../repositories/auth.repository.js';

const authenticate = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError('Access token is required', 401);
  }

  try {
    const decoded = await jwt.verify(token, env.JWT_SECRET);
    const user = await findById(decoded.userId);
    
    if (!user) {
      throw new ApiError('Token is invalid. User no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token expired. Please login again.', 401);
    }
    throw error;
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError('Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError('You do not have permission to perform this action', 403);
    }

    next();
  };
};

export { authenticate, authorize };
