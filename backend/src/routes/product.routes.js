import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  removeProduct,
  updateStock,
  updatePricing,
  getAll,
  getOne,
  addImagesToProduct,
  removeProductImage,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { upload as uploadMiddleware } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/', authenticate, authorize('admin'), uploadMiddleware, createProduct);
router.put('/:id', authenticate, authorize('admin'), uploadMiddleware, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), removeProduct);
router.patch('/:id/stock', authenticate, authorize('admin'), updateStock);
router.patch('/:id/pricing', authenticate, authorize('admin'), updatePricing);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/:id/images', authenticate, authorize('admin'), uploadMiddleware, addImagesToProduct);
router.delete('/:id/images', authenticate, authorize('admin'), removeProductImage);

export default router;
