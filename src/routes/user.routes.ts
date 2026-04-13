import { Router } from 'express';
import { getProfile } from '../controllers/user.controller';
import { updateProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// rotas protegidas
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router; // ✅ precisa ser default