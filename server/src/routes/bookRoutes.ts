import { Router } from 'express';
import { BookController } from '../controllers/bookController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Public routes (with optional auth to detect approved wholesale users)
router.get('/', optionalAuth, BookController.getBooks);
router.get('/:id', optionalAuth, BookController.getBookById);

// Admin protected routes with Multer file upload for cover image
router.post('/', protect, authorize('admin'), upload.single('coverImage'), BookController.createBook);
router.put('/:id', protect, authorize('admin'), upload.single('coverImage'), BookController.updateBook);
router.delete('/:id', protect, authorize('admin'), BookController.deleteBook);

export default router;
