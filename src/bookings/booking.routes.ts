
/**
 * Rotas de agendamento de serviços.
 * GET /         : Lista agendamentos do usuário autenticado.
 * POST /        : Cria novo agendamento para o usuário autenticado.
 * PUT /:id/confirm : Confirma um agendamento do usuário autenticado.
 */

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUserBookingsController, confirmBookingController, createBookingController } from './booking.controller';

const router = Router();

// Lista agendamentos do usuário
router.get('/', authMiddleware, getUserBookingsController);
// Cria novo agendamento
router.post('/', authMiddleware, createBookingController);
// Confirma agendamento
router.put('/:id/confirm', authMiddleware, confirmBookingController);

export default router;
