import { Router } from 'express';

import { getProfile } from '../controllers/user.controller';
import { updateProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getUserBookingsController, confirmBookingController } from '../bookings/booking.controller';

const router = Router();

// rotas protegidas
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Agendamentos
router.get('/bookings', authMiddleware, getUserBookingsController);
router.put('/bookings/:id/confirm', authMiddleware, confirmBookingController);

export default router; // ✅ precisa ser default