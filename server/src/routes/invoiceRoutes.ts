import { Router } from 'express';
import { InvoiceController } from '../controllers/invoiceController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Admin or order owner: View invoice by ID
router.get(
  '/:id',
  optionalAuth,
  InvoiceController.getById
);

export default router;
