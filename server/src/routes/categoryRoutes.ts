import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

// Public route
router.get('/', CategoryController.getAllCategories);

// Admin protected routes
router.post('/', protect, authorize('admin'), CategoryController.createCategory);
router.put('/:id', protect, authorize('admin'), CategoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), CategoryController.deleteCategory);

export default router;
