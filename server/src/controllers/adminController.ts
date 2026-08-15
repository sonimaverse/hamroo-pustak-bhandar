import { Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class AdminController {
  /**
   * GET /api/admin/stats
   * Retrieve aggregate summary metrics for admin dashboard
   */
  static async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      res.status(200).json(new ApiResponse(200, stats, 'Admin dashboard stats retrieved.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/users
   * Retrieve paginated user list for admin user management
   */
  static async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string;
      const role = req.query.role as string;
      const wholesaleStatus = req.query.wholesaleStatus as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await AdminService.getUsers({
        search,
        role,
        wholesaleStatus,
        page,
        limit,
      });

      res.status(200).json(new ApiResponse(200, result, 'Registered users retrieved.'));
    } catch (error) {
      next(error);
    }
  }
}
