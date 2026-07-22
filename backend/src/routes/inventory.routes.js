import { Router } from 'express';
import { add, remove, set, history, lowStock } from '../controllers/inventory.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.patch('/:productId/add', authenticate, authorize('admin'), add);
router.patch('/:productId/remove', authenticate, authorize('admin'), remove);
router.patch('/:productId/set', authenticate, authorize('admin'), set);
router.get('/history/:productId', authenticate, authorize('admin'), history);
router.get('/low-stock', authenticate, authorize('admin'), lowStock);

export default router;
