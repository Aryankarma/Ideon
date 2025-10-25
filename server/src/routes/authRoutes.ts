import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
} from '../controllers/authController';
import { authenticateToken } from '../utils/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router;
