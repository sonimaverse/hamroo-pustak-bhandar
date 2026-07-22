import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
} from '../controllers/auth.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authenticate, logoutUser);
router.get('/profile', authenticate, getMe);

export default router;