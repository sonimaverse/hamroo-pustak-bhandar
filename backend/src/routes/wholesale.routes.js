import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
  applyWholesale,
  getMyWholesaleApplication,
  updateMyWholesaleApplication,
  getPendingApplications,
  getApprovedApplications,
  getRejectedApplications,
  getApplicationById,
  approveWholesaleApplication,
  rejectWholesaleApplication,
} from '../controllers/wholesale.controller.js';
import {
  validate,
  applyWholesaleSchema,
  updateWholesaleSchema,
  rejectWholesaleSchema,
} from '../validators/wholesale.validation.js';

const router = Router();

/* -------------------------- USER API ROUTES -------------------------- */

// Submit wholesale application
router.post(
  '/apply',
  authenticate,
  validate(applyWholesaleSchema),
  applyWholesale
);

// View logged-in user's own application details
router.get(
  '/my-application',
  authenticate,
  getMyWholesaleApplication
);

// Update/resubmit logged-in user's own application
router.put(
  '/my-application',
  authenticate,
  validate(updateWholesaleSchema),
  updateMyWholesaleApplication
);

/* -------------------------- ADMIN API ROUTES -------------------------- */

// List pending applications (Admin only)
router.get(
  '/pending',
  authenticate,
  authorize('admin'),
  getPendingApplications
);

// List approved wholesale applications/users (Admin only)
router.get(
  '/approved',
  authenticate,
  authorize('admin'),
  getApprovedApplications
);

// List rejected wholesale applications (Admin only)
router.get(
  '/rejected',
  authenticate,
  authorize('admin'),
  getRejectedApplications
);

// View application details by User ID (Admin can view any, user can only view their own)
router.get(
  '/:id',
  authenticate,
  getApplicationById
);

// Approve application (Admin only)
router.patch(
  '/:id/approve',
  authenticate,
  authorize('admin'),
  approveWholesaleApplication
);

// Reject application (Admin only, requires rejection reason)
router.patch(
  '/:id/reject',
  authenticate,
  authorize('admin'),
  validate(rejectWholesaleSchema),
  rejectWholesaleApplication
);

export default router;
