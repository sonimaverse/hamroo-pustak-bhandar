import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';
import { ApiError } from '../utils/apiError.js';
import { UserRole } from '../models/User.js';

/**
 * Reusable role authorization middleware
 * @param allowedRoles List of roles permitted to access the route
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required to access this resource.'));
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `Access forbidden. Role '${userRole}' is not authorized to perform this action.`
        )
      );
    }

    next();
  };
};
