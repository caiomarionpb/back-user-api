// src/routes/auth.routes.ts
import { Router } from 'express';
import { login, register, getProfile, updateProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;