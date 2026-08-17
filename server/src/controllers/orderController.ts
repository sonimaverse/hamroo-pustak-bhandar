// server/src/controllers/orderController.ts

import { Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators/orderValidator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

export class OrderController {
  /**
   * =========================================================
   * POST /api/orders
   * =========================================================
   */
  static async checkout(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      /* =====================================================
         USER
      ====================================================== */

      const userId = req.user
        ? req.user._id.toString()
        : null;

      /* =====================================================
         DEBUG - PAYMENT FILE
      ====================================================== */

      console.log(
        '\n========== PAYMENT SCREENSHOT DEBUG =========='
      );

      console.log(
        'Content-Type:',
        req.headers['content-type']
      );

      console.log(
        'req.file:',
        req.file
          ? {
              fieldname: req.file.fieldname,
              originalname: req.file.originalname,
              encoding: req.file.encoding,
              mimetype: req.file.mimetype,
              size: req.file.size,
            }
          : null
      );

      console.log(
        'req.body keys:',
        Object.keys(req.body || {})
      );

      console.log(
        '==============================================\n'
      );

      /* =====================================================
         COPY REQUEST BODY
      ====================================================== */

      const body: any = {
        ...req.body,
      };

      /* =====================================================
         PARSE ITEMS
      ====================================================== */

      if (typeof body.items === 'string') {
        try {
          body.items = JSON.parse(body.items);
        } catch {
          throw new ApiError(
            400,
            'Invalid order items format.'
          );
        }
      }

      /* =====================================================
         PARSE SHIPPING ADDRESS
      ====================================================== */

      if (
        typeof body.shippingAddress === 'string'
      ) {
        try {
          body.shippingAddress =
            JSON.parse(body.shippingAddress);
        } catch {
          throw new ApiError(
            400,
            'Invalid shipping address format.'
          );
        }
      }

      /* =====================================================
         PAYMENT SCREENSHOT
      ====================================================== */

      if (req.file) {
        console.log(
          '🖼️ Payment screenshot received:',
          req.file.originalname
        );

        console.log(
          '📦 File size:',
          req.file.size,
          'bytes'
        );

        console.log(
          '📝 MIME type:',
          req.file.mimetype
        );

        try {
          console.log(
            '☁️ Uploading payment screenshot to Cloudinary...'
          );

          const uploadResult =
            await uploadToCloudinary(
              req.file.buffer,
              'hamro_pustak_bhandar/payment-screenshots'
            );

          /* -------------------------------------------------
             Convert Cloudinary result to URL
          ------------------------------------------------- */

          let screenshotUrl = '';

          if (
            typeof uploadResult === 'string'
          ) {
            screenshotUrl = uploadResult;
          } else if (
            uploadResult &&
            typeof uploadResult === 'object'
          ) {
            const result: any =
              uploadResult;

            screenshotUrl =
              result.secure_url ||
              result.url ||
              result.secureUrl ||
              '';
          }

          /* -------------------------------------------------
             Verify URL
          ------------------------------------------------- */

          if (!screenshotUrl) {
            console.error(
              '❌ Cloudinary returned no URL.'
            );

            throw new ApiError(
              500,
              'Payment screenshot upload failed.'
            );
          }

          body.paymentScreenshot =
            screenshotUrl;

          console.log(
            '✅ Payment screenshot uploaded successfully.'
          );

          console.log(
            '🔗 Cloudinary URL:',
            body.paymentScreenshot
          );
        } catch (uploadError: any) {
          console.error(
            '❌ PAYMENT SCREENSHOT UPLOAD ERROR:',
            uploadError
          );

          throw new ApiError(
            500,
            uploadError?.message ||
              'Failed to upload payment screenshot.'
          );
        }
      } else {
        console.log(
          '⚠️ No payment screenshot received in req.file.'
        );

        /*
         * Keep this as an empty string so Zod
         * and MongoDB receive the expected type.
         */
        body.paymentScreenshot = '';
      }

      /* =====================================================
         FINAL PAYMENT SCREENSHOT DEBUG
      ====================================================== */

      console.log(
        '📌 FINAL paymentScreenshot value:',
        body.paymentScreenshot
      );

      /* =====================================================
         VALIDATE ORDER
      ====================================================== */

      const validatedInput =
        createOrderSchema.parse(body);

      console.log(
        '✅ Order validation successful.'
      );

      /* =====================================================
         CREATE ORDER
      ====================================================== */

      const order =
        await OrderService.checkout(
          userId,
          validatedInput
        );

      /* =====================================================
         VERIFY SAVED ORDER
      ====================================================== */

      console.log(
        '✅ ORDER CREATED:',
        order?._id?.toString()
      );

      console.log(
        '🖼️ SAVED PAYMENT SCREENSHOT:',
        (order as any)?.paymentScreenshot || ''
      );

      console.log(
        '================================================\n'
      );

      /* =====================================================
         RESPONSE
      ====================================================== */

      res.status(201).json(
        new ApiResponse(
          201,
          { order },
          'Order placed successfully.'
        )
      );
    } catch (error) {
      console.error(
        '❌ ORDER CHECKOUT ERROR:',
        error
      );

      next(error);
    }
  }

  /**
   * =========================================================
   * GET /api/orders/my-orders
   * =========================================================
   */
  static async getMyOrders(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          'Authentication required.'
        );
      }

      const orders =
        await OrderService.getMyOrders(
          req.user._id.toString()
        );

      res.status(200).json(
        new ApiResponse(
          200,
          { orders },
          'User order history retrieved.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * GET /api/orders/:id
   * =========================================================
   */
  static async getOrderById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(
          400,
          'Order ID is required.'
        );
      }

      const userId = req.user
        ? req.user._id.toString()
        : null;

      const userRole = req.user
        ? req.user.role
        : 'guest';

      const order =
        await OrderService.getOrderById(
          userId,
          userRole,
          id
        );

      res.status(200).json(
        new ApiResponse(
          200,
          { order },
          'Order details retrieved.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * GET /api/admin/orders
   * =========================================================
   */
  static async listOrders(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderStatus =
        typeof req.query.orderStatus === 'string'
          ? req.query.orderStatus
          : undefined;

      const paymentStatus =
        typeof req.query.paymentStatus === 'string'
          ? req.query.paymentStatus
          : undefined;

      const orderType =
        typeof req.query.orderType === 'string'
          ? req.query.orderType
          : undefined;

      const search =
        typeof req.query.search === 'string'
          ? req.query.search
          : undefined;

      let page = 1;

      if (
        typeof req.query.page === 'string'
      ) {
        const parsedPage = parseInt(
          req.query.page,
          10
        );

        if (
          Number.isFinite(parsedPage) &&
          parsedPage > 0
        ) {
          page = parsedPage;
        }
      }

      let limit = 20;

      if (
        typeof req.query.limit === 'string'
      ) {
        const parsedLimit = parseInt(
          req.query.limit,
          10
        );

        if (
          Number.isFinite(parsedLimit) &&
          parsedLimit > 0
        ) {
          limit = parsedLimit;
        }
      }

      const result =
        await OrderService.getAllOrders({
          orderStatus,
          paymentStatus,
          orderType,
          page,
          limit,
          search,
        });

      res.status(200).json(
        new ApiResponse(
          200,
          result,
          'Admin order list retrieved successfully.'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * =========================================================
   * PUT /api/admin/orders/:id/status
   * =========================================================
   */
  static async updateOrderStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(
          400,
          'Order ID is required.'
        );
      }

      const validatedInput =
        updateOrderStatusSchema.parse(
          req.body
        );

      const order =
        await OrderService.updateOrderStatus(
          id,
          validatedInput
        );

      res.status(200).json(
        new ApiResponse(
          200,
          { order },
          'Order status updated successfully.'
        )
      );
    } catch (error) {
      next(error);
    }
  }
}