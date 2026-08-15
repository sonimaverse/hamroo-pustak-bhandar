import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', protect, AuthController.getMe);
router.put('/profile', protect, AuthController.updateProfile);

export default router;
