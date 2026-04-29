/**
 * Rotas de autenticação e perfil do usuário.
 * POST /login: Realiza login do usuário.
 * POST /register: Realiza cadastro de novo usuário.
 * GET /profile: Retorna dados do perfil do usuário autenticado.
 * PUT /profile: Atualiza dados do perfil do usuário autenticado.
 */

import { Router } from 'express';
import { login, register, getProfile, updateProfile, loginBarber } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Login do usuário
router.post('/login', login);
// Cadastro de novo usuário
router.post('/register', register);
// Consulta perfil do usuário autenticado
router.get('/profile', authMiddleware, getProfile);
// Atualiza perfil do usuário autenticado
router.put('/profile', authMiddleware, updateProfile);

// Login do barbeiro
router.post('/barber/login', loginBarber);

export default router;