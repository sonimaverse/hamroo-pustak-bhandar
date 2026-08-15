import { Router } from 'express';
import { QuotationController } from '../controllers/quotationController.js';

const router = Router();

// Public/Client: View quotation by ID
router.get('/:id', QuotationController.getById);

export default router;
