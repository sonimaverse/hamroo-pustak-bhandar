import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  removeProduct,
  updateStock,
  updatePricing,
  getAll,
  getOne,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, authorize('admin'), createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), removeProduct);
router.patch('/:id/stock', authenticate, authorize('admin'), updateStock);
router.patch('/:id/pricing', authenticate, authorize('admin'), updatePricing);
router.get('/', getAll);
router.get('/:id', getOne);

export default router;
