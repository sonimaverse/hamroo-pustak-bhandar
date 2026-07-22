import { ApiError } from '../utils/apiError.js';
import { USER_ROLES } from '../utils/constants.js';

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(new ApiError('Authentication required', 401));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

const authorizePermission = (checkFn) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(new ApiError('Authentication required', 401));
    }

    const hasPermission = checkFn(userRole, req.user);

    if (!hasPermission) {
      return next(new ApiError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

export { authorizeRole, authorizePermission };
