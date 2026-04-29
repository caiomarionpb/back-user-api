/**
 * Cancela um agendamento do usuário, se estiver marcado ou confirmado.
 * @param bookingId ID do agendamento
 * @param userId ID do usuário
 */
export const cancelBooking = async (bookingId: number, userId: number): Promise<void> => {
  const res = await executeQuery<any[]>(
    'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status IN ("marcado", "confirmado")',
    [bookingId, userId]
  );
  if (!res.length) throw { status: 404, message: 'Agendamento não encontrado ou já cancelado' };
  await executeQuery('UPDATE bookings SET status = "cancelado" WHERE id = ?', [bookingId]);
};

/**
 * Cria um novo agendamento para o usuário, se não houver conflito de horário.
 * @param userId ID do usuário
 * @param service Nome do serviço
 * @param date Data do agendamento
 * @param time Horário do agendamento
 * @param price Preço do serviço
 * @returns Booking criado
 */
export const createBooking = async (
  userId: number,
  service: string,
  date: string,
  time: string,
  price: number,
  barberId: number
): Promise<Booking> => {
  // Não permitir agendamento duplicado para o mesmo horário
  const exists = await executeQuery<any[]>(
    'SELECT id FROM bookings WHERE user_id = ? AND date = ? AND time = ? AND status IN ("marcado", "confirmado")',
    [userId, date, time]
  );
  if (exists.length) throw { status: 409, message: 'Já existe um agendamento para este horário' };
  const result: any = await executeQuery(
    'INSERT INTO bookings (user_id, service, date, time, price, barber_id, status) VALUES (?, ?, ?, ?, ?, ?, "marcado")',
    [userId, service, date, time, price, barberId]
  );
  const [booking] = await executeQuery<Booking[]>(
    'SELECT * FROM bookings WHERE id = ?',
    [result.insertId]
  );
  return booking;
};
import connection from '../config/db';


/**
 * Interface que representa um agendamento.
 */
export interface Booking {
  id: number;
  user_id: number;
  barber_id: number;
  service: string;
  date: string;
  time: string;
  price: number;
  status: string;
  created_at: string;
}


/**
 * Executa uma query SQL usando a conexão do banco de dados.
 * @param query Query SQL
 * @param params Parâmetros da query
 * @returns Resultado tipado
 */
const executeQuery = <T>(query: string, params: any[] = []): Promise<T> => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results as T);
    });
  });
};


/**
 * Busca todos os agendamentos do usuário autenticado, separando futuros e históricos.
 * @param userId ID do usuário
 * @returns Objetos future (futuros) e history (históricos)
 */
export const getUserBookings = async (userId: number): Promise<{ future: Booking[]; history: Booking[] }> => {
  const today = new Date().toISOString().split('T')[0];
  const future = await executeQuery<Booking[]>(
    `SELECT * FROM bookings WHERE user_id = ? AND date >= ? AND status IN ('marcado', 'confirmado') ORDER BY date, time`,
    [userId, today]
  );
  const history = await executeQuery<Booking[]>(
    `SELECT * FROM bookings WHERE user_id = ? AND (date < ? OR status IN ('encerrado', 'cancelado')) ORDER BY date DESC, time DESC`,
    [userId, today]
  );
  console.log('[BOOKINGS] user:', userId, 'today:', today, 'future:', future, 'history:', history);
  return { future, history };
};


/**
 * Confirma um agendamento do usuário, se estiver marcado.
 * @param bookingId ID do agendamento
 * @param userId ID do usuário
 */
export const confirmBooking = async (bookingId: number, userId: number): Promise<void> => {
  const res = await executeQuery<any[]>(
    'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = "marcado"',
    [bookingId, userId]
  );
  if (!res.length) throw { status: 404, message: 'Agendamento não encontrado ou já confirmado' };
  await executeQuery('UPDATE bookings SET status = "confirmado" WHERE id = ?', [bookingId]);
};

/**
 * Busca todos os agendamentos de um barbeiro para o dia atual.
 * @param barberId ID do barbeiro
 * @returns Lista de agendamentos
 */
export const getBarberBookingsForToday = async (barberId: number): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];
  const bookings = await executeQuery<Booking[]>(
    `SELECT b.*, u.name as user_name FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.barber_id = ? AND b.date = ? AND b.status IN ('marcado', 'confirmado') ORDER BY b.time`,
    [barberId, today]
  );
  return bookings;
};
