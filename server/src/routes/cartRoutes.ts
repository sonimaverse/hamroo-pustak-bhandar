import { Router } from 'express';
import { CartController } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, CartController.getCart);
router.post('/items', protect, CartController.addItem);
router.put('/items/:bookId', protect, CartController.updateItemQuantity);
router.delete('/items/:bookId', protect, CartController.removeItem);
router.delete('/', protect, CartController.clearCart);

export default router;
