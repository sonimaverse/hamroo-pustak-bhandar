import { Router } from 'express';
import { WholesaleController } from '../controllers/wholesaleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Submit wholesale application with document file upload
router.post('/apply', protect, upload.single('document'), WholesaleController.apply);

// Get current user's wholesale application status
router.get('/status', protect, WholesaleController.getStatus);

export default router;
