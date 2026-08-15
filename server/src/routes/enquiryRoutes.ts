import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiryController.js';

const router = Router();

// Public: Submit institutional enquiry
router.post('/', EnquiryController.create);

export default router;
