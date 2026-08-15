import { Response, NextFunction } from 'express';
import { CartService } from '../services/cartService.js';
import { addToCartSchema, updateCartItemSchema } from '../validators/orderValidator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export class CartController {
  /**
   * GET /api/cart
   * Get authenticated user's cart
   */
  static async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError(401, 'Authentication required.');

      const cart = await CartService.getCart(req.user._id.toString());
      res.status(200).json(new ApiResponse(200, cart, 'User cart retrieved successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/cart/items
   * Add item to cart
   */
  static async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError(401, 'Authentication required.');

      const { bookId, quantity } = addToCartSchema.parse(req.body);
      const updatedCart = await CartService.addItem(req.user._id.toString(), bookId, quantity);

      res.status(200).json(new ApiResponse(200, updatedCart, 'Item added to cart successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/cart/items/:bookId
   * Update item quantity in cart
   */
  static async updateItemQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError(401, 'Authentication required.');

      const { bookId } = req.params;
      const { quantity } = updateCartItemSchema.parse(req.body);

      const updatedCart = await CartService.updateItemQuantity(req.user._id.toString(), bookId, quantity);

      res.status(200).json(new ApiResponse(200, updatedCart, 'Cart item quantity updated successfully.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/cart/items/:bookId
   * Remove item from cart
   */
  static async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError(401, 'Authentication required.');

      const { bookId } = req.params;
      const updatedCart = await CartService.removeItem(req.user._id.toString(), bookId);

      res.status(200).json(new ApiResponse(200, updatedCart, 'Item removed from cart.'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/cart
   * Clear all items from cart
   */
  static async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) throw new ApiError(401, 'Authentication required.');

      const updatedCart = await CartService.clearCart(req.user._id.toString());
      res.status(200).json(new ApiResponse(200, updatedCart, 'Cart cleared successfully.'));
    } catch (error) {
      next(error);
    }
  }
}
