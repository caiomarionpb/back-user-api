import { Request, Response } from 'express';
import { cancelBooking, createBooking, getUserBookings, confirmBooking, getBarberBookingsForToday } from './booking.service';

/**
 * Envia resposta de erro padronizada para o cliente.
 * @param res Response
 * @param error Erro lançado
 * @param defaultMessage Mensagem padrão caso não haja status customizado
 */
const sendServiceError = (res: Response, error: unknown, defaultMessage: string) => {
  if (error && typeof error === 'object' && 'status' in error) {
    const { status, message } = error as { status: number; message: string };
    return res.status(status).json({ error: message });
  }
  return res.status(500).json({ error: defaultMessage });
};

/**
 * Controller para cancelar um agendamento do usuário autenticado.
 * Espera o id do agendamento na URL.
 */
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

/**
 * Controller para criar um novo agendamento para o usuário autenticado.
 * Espera service, date, time e price no body.
 */
export const createBookingController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { service, date, time, price, barberId } = req.body;
  if (!userId || !service || !date || !time || !price || !barberId) {
    return res.status(400).json({ error: 'Dados insuficientes para agendar' });
  }
  try {
    const booking = await createBooking(userId, service, date, time, price, barberId);
    return res.status(201).json(booking);
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao criar agendamento');
  }
};

/**
 * Controller para listar todos os agendamentos do usuário autenticado.
 */
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

/**
 * Controller para o barbeiro buscar seus agendamentos do dia.
 */
export const getBarberBookingsController = async (req: Request, res: Response) => {
  const barberId = (req as any).user?.id;
  if (!barberId) {
    return res.status(401).json({ error: 'Barbeiro não autenticado' });
  }
  try {
    const bookings = await getBarberBookingsForToday(barberId);
    return res.json(bookings);
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao buscar agendamentos do barbeiro');
  }
};

/**
 * Controller para confirmar um agendamento do usuário autenticado.
 * Espera o id do agendamento na URL.
 */
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
