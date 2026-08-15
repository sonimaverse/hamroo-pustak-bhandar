import { Request, Response, NextFunction } from 'express';
import { QuotationService } from '../services/quotationService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class QuotationController {
  /**
   * POST /api/admin/quotations
   * Admin: Create and issue a quotation
   */
  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        enquiryId,
        clientName,
        clientEmail,
        clientPhone,
        organizationName,
        items,
        subtotal,
        discount,
        tax,
        grandTotal,
        notes,
        validUntil,
      } = req.body;

      if (!clientName || !clientEmail || !clientPhone || !organizationName || !items || !items.length || !grandTotal || !validUntil) {
        throw new ApiError(400, 'Missing required quotation fields.');
      }

      const quotation = await QuotationService.createQuotation({
        enquiryId,
        clientName,
        clientEmail,
        clientPhone,
        organizationName,
        items,
        subtotal: Number(subtotal),
        discount: discount ? Number(discount) : 0,
        tax: tax ? Number(tax) : 0,
        grandTotal: Number(grandTotal),
        notes,
        validUntil: new Date(validUntil),
        createdBy: req.user?._id?.toString(),
      });

      res.status(201).json(
        new ApiResponse(201, { quotation }, 'Quotation created successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/quotations
   * Admin: List all quotations
   */
  static async listAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const quotations = await QuotationService.getAllQuotations();

      res.status(200).json(
        new ApiResponse(200, { quotations }, 'Quotations retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/quotations/:id
   * Public/Customer View: View quotation by ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const quotation = await QuotationService.getQuotationById(id);

      res.status(200).json(
        new ApiResponse(200, { quotation }, 'Quotation details retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }
}
