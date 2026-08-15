import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, OrderController.checkout);
router.get('/my-orders', protect, OrderController.getMyOrders);
router.get('/:id', protect, OrderController.getOrderById);

export default router;
