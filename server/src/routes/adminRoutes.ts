import { Router } from 'express';
import { WholesaleController } from '../controllers/wholesaleController.js';
import { OrderController } from '../controllers/orderController.js';
import { AdminController } from '../controllers/adminController.js';
import { EnquiryController } from '../controllers/enquiryController.js';
import { QuotationController } from '../controllers/quotationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

// Admin Dashboard Overview Stats
router.get(
  '/stats',
  protect,
  authorize('admin'),
  AdminController.getStats
);

// Admin User Management
router.get(
  '/users',
  protect,
  authorize('admin'),
  AdminController.getUsers
);

// Admin Wholesale Applications Management
router.get(
  '/wholesale-applications',
  protect,
  authorize('admin'),
  WholesaleController.listApplications
);

router.get(
  '/wholesale-applications/:id',
  protect,
  authorize('admin'),
  WholesaleController.getApplicationById
);

router.put(
  '/wholesale-applications/:id/approve',
  protect,
  authorize('admin'),
  WholesaleController.approveApplication
);

router.put(
  '/wholesale-applications/:id/reject',
  protect,
  authorize('admin'),
  WholesaleController.rejectApplication
);

// Admin Order Management
router.get(
  '/orders',
  protect,
  authorize('admin'),
  OrderController.listOrders
);

router.put(
  '/orders/:id/status',
  protect,
  authorize('admin'),
  OrderController.updateOrderStatus
);

// Admin Enquiry Management
router.get(
  '/enquiries',
  protect,
  authorize('admin'),
  EnquiryController.listAll
);

router.get(
  '/enquiries/:id',
  protect,
  authorize('admin'),
  EnquiryController.getById
);

router.put(
  '/enquiries/:id/status',
  protect,
  authorize('admin'),
  EnquiryController.updateStatus
);

// Admin Quotation Management
router.post(
  '/quotations',
  protect,
  authorize('admin'),
  QuotationController.create
);

router.get(
  '/quotations',
  protect,
  authorize('admin'),
  QuotationController.listAll
);

export default router;
