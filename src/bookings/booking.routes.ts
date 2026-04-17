import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUserBookingsController, confirmBookingController, createBookingController } from './booking.controller';

const router = Router();


// Agendamentos do usuário
router.get('/', authMiddleware, getUserBookingsController);
router.post('/', authMiddleware, createBookingController);
router.put('/:id/confirm', authMiddleware, confirmBookingController);

export default router;
