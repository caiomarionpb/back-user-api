import { cancelBooking } from './booking.service';
export const cancelBookingController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const bookingId = Number(req.params.id);
  if (!userId || !bookingId) {
    return res.status(400).json({ error: 'Dados insuficientes' });
  }
  try {
    await cancelBooking(bookingId, userId);
    return res.json({ message: 'Agendamento cancelado!' });
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao cancelar agendamento');
  }
};
import { createBooking } from './booking.service';
export const createBookingController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { service, date, time, price } = req.body;
  if (!userId || !service || !date || !time || !price) {
    return res.status(400).json({ error: 'Dados insuficientes para agendar' });
  }
  try {
    const booking = await createBooking(userId, service, date, time, price);
    return res.status(201).json(booking);
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao criar agendamento');
  }
};
import { Request, Response } from 'express';
import { getUserBookings, confirmBooking } from './booking.service';

const sendServiceError = (res: Response, error: unknown, defaultMessage: string) => {
  if (error && typeof error === 'object' && 'status' in error) {
    const { status, message } = error as { status: number; message: string };
    return res.status(status).json({ error: message });
  }
  return res.status(500).json({ error: defaultMessage });
};

export const getUserBookingsController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  console.log('[BOOKINGS CONTROLLER] chamada para user:', userId);
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  try {
    const bookings = await getUserBookings(userId);
    return res.json(bookings);
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao buscar agendamentos');
  }
};

export const confirmBookingController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const bookingId = Number(req.params.id);
  if (!userId || !bookingId) {
    return res.status(400).json({ error: 'Dados insuficientes' });
  }
  try {
    await confirmBooking(bookingId, userId);
    return res.json({ message: 'Agendamento confirmado!' });
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao confirmar agendamento');
  }
};
