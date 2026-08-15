import { Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/orderValidator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class OrderController {
  /**
   * POST /api/orders
   * Checkout: Create order from user's current cart or guest cart items
   */
  static async checkout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user ? req.user._id.toString() : null;
      const validatedInput = createOrderSchema.parse(req.body);
      const order = await OrderService.checkout(userId, validatedInput);

      res.status(201).json(new ApiResponse(201, { order }, 'Order placed successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/my-orders
   * Get user's own order history
   */
  static async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError(401, 'Authentication required.');

      const orders = await OrderService.getMyOrders(req.user._id.toString());
      res.status(200).json(new ApiResponse(200, { orders }, 'User order history retrieved.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/:id
   * Get order by ID (security check: owner, admin, or guest invoice)
   */
  static async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user._id.toString() : null;
      const userRole = req.user ? req.user.role : 'guest';

      const order = await OrderService.getOrderById(userId, userRole, id);

      res.status(200).json(new ApiResponse(200, { order }, 'Order details retrieved.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/orders
   * Admin: Get all orders with filters
   */
  static async listOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const orderStatus = req.query.orderStatus as string;
      const paymentStatus = req.query.paymentStatus as string;
      const orderType = req.query.orderType as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = await OrderService.getAllOrders({
        orderStatus,
        paymentStatus,
        orderType,
        page,
        limit,
      });

      res.status(200).json(new ApiResponse(200, result, 'Admin order list retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/admin/orders/:id/status
   * Admin: Update orderStatus or paymentStatus
   */
  static async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedInput = updateOrderStatusSchema.parse(req.body);

      const order = await OrderService.updateOrderStatus(id, validatedInput);
      res.status(200).json(new ApiResponse(200, { order }, 'Order status updated successfully.'));
    } catch (error) {
      next(error);
    }
  }
}
