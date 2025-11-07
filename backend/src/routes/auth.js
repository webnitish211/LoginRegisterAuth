
import express from 'express';
const router = express.Router();

// Destructure controller functions
import { register, login, forgotPassword, resetPassword, getMe } from '../controllers/authControllers.js';

// Destructure middleware function
import { protect } from '../middleware/authMiddleware.js';

// Public routes (No authentication required)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
// Note: While the image uses router.post, router.put is often more semantically correct for updating a password.

// Protected routes (Require JWT token/Authentication)
router.get('/me', protect, getMe);

export default router;