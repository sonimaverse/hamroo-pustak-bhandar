import { Router } from 'express';
import { applyWholesale, getMyWholesaleApplication } from '../controllers/wholesale.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import {
  getPendingApplications,
  getApplicationById,
  approveWholesaleApplication,
  rejectWholesaleApplication,
} from '../controllers/wholesale.controller.js';

const router = Router();

router.post('/apply', authenticate, applyWholesale);
router.get('/my-application', authenticate, getMyWholesaleApplication);
router.get('/pending', authenticate, authorize('admin'), getPendingApplications);
router.get('/:id', authenticate, getApplicationById);
router.post('/:id/approve', authenticate, authorize('admin'), approveWholesaleApplication);
router.post('/:id/reject', authenticate, authorize('admin'), rejectWholesaleApplication);

export default router;
