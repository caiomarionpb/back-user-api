
/**
 * Rotas de usuário autenticado e gerenciamento de agendamentos do usuário.
 * GET /profile: Retorna dados do perfil do usuário autenticado.
 * PUT /profile: Atualiza dados do perfil do usuário autenticado.
 * GET /bookings: Lista agendamentos do usuário autenticado.
 * PUT /bookings/:id/cancel: Cancela um agendamento do usuário.
 * PUT /bookings/:id/confirm: Confirma um agendamento do usuário.
 */

import { Router } from 'express';

import { getProfile } from '../controllers/user.controller';
import { updateProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUserBookingsController, confirmBookingController, cancelBookingController } from '../bookings/booking.controller';

const router = Router();

// Rotas protegidas de perfil
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Listagem de agendamentos do usuário
router.get('/bookings', authMiddleware, getUserBookingsController);

// Cancelamento e confirmação de agendamento
router.put('/bookings/:id/cancel', authMiddleware, cancelBookingController);
router.put('/bookings/:id/confirm', authMiddleware, confirmBookingController);

export default router; // ✅ precisa ser default