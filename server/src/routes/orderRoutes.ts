import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post(
  '/',
  upload.single('paymentScreenshot'),
  optionalAuth,
  OrderController.checkout
);

router.get(
  '/my-orders',
  protect,
  OrderController.getMyOrders
);

router.get(
  '/:id',
  optionalAuth,
  OrderController.getOrderById
);

export default router;