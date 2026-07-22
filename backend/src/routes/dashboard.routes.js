import { Router } from 'express';
import { overview, productStats, userStats } from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/overview', authenticate, authorize('admin'), overview);
router.get('/products/stats', authenticate, authorize('admin'), productStats);
router.get('/users/stats', authenticate, authorize('admin'), userStats);

export default router;
