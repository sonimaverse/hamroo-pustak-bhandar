import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import { User, IUser } from '../models/User.js';
import { fallbackStore } from '../services/fallbackStore.js';
import { getDbStatus } from '../config/db.js';

export interface AuthenticatedRequest extends Request {
  user?: IUser | any;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Authentication failed. Access token is missing.');
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      throw new ApiError(401, 'Authentication failed. Token is invalid or expired.');
    }

    const dbState = getDbStatus();
    let currentUser: any;

    if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
      currentUser = await User.findById(decoded.id);
    } else {
      currentUser = fallbackStore.findUserById(decoded.id);
    }

    if (!currentUser) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.');
    }

    req.user = currentUser;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid authentication token.'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Authentication token has expired. Please log in again.'));
    } else {
      next(error);
    }
  }
};

/**
 * Optional authentication middleware: Populates req.user if valid token provided, otherwise continues
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);
    if (decoded && decoded.id) {
      const dbState = getDbStatus();
      let currentUser: any;

      if (dbState.mode === 'mongodb_atlas' && dbState.isConnected) {
        currentUser = await User.findById(decoded.id);
      } else {
        currentUser = fallbackStore.findUserById(decoded.id);
      }

      if (currentUser) {
        req.user = currentUser;
      }
    }
    next();
  } catch (err) {
    // Fail silently for optional auth
    next();
  }
};
