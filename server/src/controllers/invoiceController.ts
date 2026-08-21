import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/invoiceService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class InvoiceController {
  /**
   * POST /api/admin/invoices/generate/:orderId
   * Admin: Generate an invoice from an existing order
   */
  static async generateFromOrder(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { orderId } = req.params;
      const { discount, tax, notes, dueDate } = req.body;

      if (!orderId) {
        throw new ApiError(400, 'Order ID is required.');
      }

      const invoice = await InvoiceService.generateFromOrder(
        orderId,
        {
          discount: discount ? Number(discount) : 0,
          tax: tax ? Number(tax) : 0,
          notes,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
        req.user?._id?.toString()
      );

      res.status(201).json(
        new ApiResponse(201, { invoice }, 'Invoice generated successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/invoices
   * Admin: List all invoices
   */
  static async listAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const invoices = await InvoiceService.getAllInvoices();

      res.status(200).json(
        new ApiResponse(200, { invoices }, 'Invoices retrieved successfully.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/invoices/order/:orderId
   * Admin or order owner: View invoice linked to an order
   */
  static async getByOrderId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        throw new ApiError(400, 'Order ID is required.');
      }

      const userId = req.user ? req.user._id.toString() : null;
      const userRole = req.user ? req.user.role : 'guest';

      const invoice = await InvoiceService.getInvoiceByOrderId(orderId, userId, userRole);

      res.status(200).json(
        new ApiResponse(200, { invoice }, 'Invoice details retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/invoices/:id
   * Admin or order owner: View invoice by ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(400, 'Invoice ID is required.');
      }

      const userId = req.user ? req.user._id.toString() : null;
      const userRole = req.user ? req.user.role : 'guest';

      const invoice = await InvoiceService.getInvoiceById(id, userId, userRole);

      res.status(200).json(
        new ApiResponse(200, { invoice }, 'Invoice details retrieved.')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/invoices/:id/payments
   * Admin: Record a payment against an invoice
   */
  static async recordPayment(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { amount, paymentMethod, paymentScreenshot, notes } = req.body;

      if (!id) {
        throw new ApiError(400, 'Invoice ID is required.');
      }

      if (!amount || Number(amount) <= 0) {
        throw new ApiError(400, 'Valid payment amount is required.');
      }

      const invoice = await InvoiceService.recordPayment(id, {
        amount: Number(amount),
        paymentMethod: paymentMethod || 'Cash on Delivery',
        paymentScreenshot: paymentScreenshot || '',
        notes,
      });

      res.status(200).json(
        new ApiResponse(200, { invoice }, 'Payment recorded successfully.')
      );
    } catch (error) {
      next(error);
    }
  }
}
