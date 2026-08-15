import { Response, NextFunction } from 'express';
import { WholesaleService } from '../services/wholesaleService.js';
import { applyWholesaleSchema, rejectWholesaleSchema } from '../validators/wholesaleValidator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export class WholesaleController {
  /**
   * POST /api/wholesale/apply
   * Submit wholesale application (Customer only)
   */
  static async apply(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication is required to apply for wholesale status.');
      }

      let documentUrl = req.body.documentUrl;

      if (req.file) {
        documentUrl = await uploadToCloudinary(req.file.buffer, 'hamro_pustak_bhandar/documents');
      }

      if (!documentUrl) {
        throw new ApiError(400, 'Business registration or PAN/VAT certificate document is required.');
      }

      const validatedInput = applyWholesaleSchema.parse(req.body);

      const profile = await WholesaleService.applyForWholesale(
        req.user._id.toString(),
        validatedInput,
        documentUrl
      );

      res.status(201).json(
        new ApiResponse(201, { application: profile }, 'Wholesale application submitted successfully and is pending review.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/wholesale/status
   * Get current authenticated user's wholesale application status
   */
  static async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required.');
      }

      const statusData = await WholesaleService.getWholesaleStatus(req.user._id.toString());

      res.status(200).json(
        new ApiResponse(200, statusData, 'Wholesale application status retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/wholesale-applications
   * Admin: List wholesale applications
   */
  static async listApplications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const statusFilter = req.query.status as string;
      const applications = await WholesaleService.getAllApplications(statusFilter);

      res.status(200).json(
        new ApiResponse(200, { applications }, 'Wholesale applications retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/wholesale-applications/:id
   * Admin: View application details
   */
  static async getApplicationById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const application = await WholesaleService.getApplicationById(id);

      res.status(200).json(
        new ApiResponse(200, { application }, 'Wholesale application details retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/wholesale-applications/:id/approve
   * Admin: Approve wholesale application
   */
  static async approveApplication(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const application = await WholesaleService.approveApplication(id);

      res.status(200).json(
        new ApiResponse(200, { application }, 'Wholesale application approved successfully. User role upgraded to wholesale.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/wholesale-applications/:id/reject
   * Admin: Reject wholesale application
   */
  static async rejectApplication(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { rejectionReason } = rejectWholesaleSchema.parse(req.body);

      const application = await WholesaleService.rejectApplication(id, rejectionReason);

      res.status(200).json(
        new ApiResponse(200, { application }, 'Wholesale application rejected.')
      );
    } catch (error) {
      next(error);
    }
  }
}
