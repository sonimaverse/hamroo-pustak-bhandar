import { Request, Response, NextFunction } from 'express';
import { EnquiryService } from '../services/enquiryService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class EnquiryController {
  /**
   * POST /api/enquiries
   * Submit institutional/business enquiry (Public - no auth required)
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { organizationName, organizationType, contactPerson, email, phone, address, requirements, estimatedQuantity } = req.body;

      if (!organizationName || !organizationType || !contactPerson || !email || !phone || !address || !requirements) {
        throw new ApiError(400, 'All required enquiry fields must be provided.');
      }

      const enquiry = await EnquiryService.createEnquiry({
        organizationName,
        organizationType,
        contactPerson,
        email,
        phone,
        address,
        requirements,
        estimatedQuantity: estimatedQuantity ? Number(estimatedQuantity) : 1,
      });

      res.status(201).json(
        new ApiResponse(201, { enquiry }, 'Institutional enquiry submitted successfully. Our team will review and contact you with a quotation.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/enquiries
   * Admin: List all enquiries
   */
  static async listAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const statusFilter = req.query.status as string;
      const enquiries = await EnquiryService.getAllEnquiries(statusFilter);

      res.status(200).json(
        new ApiResponse(200, { enquiries }, 'Enquiries retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/enquiries/:id
   * Admin: View enquiry details
   */
  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry = await EnquiryService.getEnquiryById(id);

      res.status(200).json(
        new ApiResponse(200, { enquiry }, 'Enquiry details retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/enquiries/:id/status
   * Admin: Update enquiry status
   */
  static async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'quoted', 'closed'].includes(status)) {
        throw new ApiError(400, 'Invalid status value.');
      }

      const enquiry = await EnquiryService.updateEnquiryStatus(id, status);

      res.status(200).json(
        new ApiResponse(200, { enquiry }, 'Enquiry status updated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}
