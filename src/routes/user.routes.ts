import { Router } from 'express';
import { getProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// rota protegida
router.get('/profile', authMiddleware, getProfile);

export default router; // ✅ precisa ser default