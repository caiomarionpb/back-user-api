export const createBooking = async (
  userId: number,
  service: string,
  date: string,
  time: string,
  price: number
): Promise<Booking> => {
  // Não permitir agendamento duplicado para o mesmo horário
  const exists = await executeQuery<any[]>(
    'SELECT id FROM bookings WHERE user_id = ? AND date = ? AND time = ? AND status IN ("marcado", "confirmado")',
    [userId, date, time]
  );
  if (exists.length) throw { status: 409, message: 'Já existe um agendamento para este horário' };
  const result: any = await executeQuery(
    'INSERT INTO bookings (user_id, service, date, time, price, status) VALUES (?, ?, ?, ?, ?, "marcado")',
    [userId, service, date, time, price]
  );
  const [booking] = await executeQuery<Booking[]>(
    'SELECT * FROM bookings WHERE id = ?',
    [result.insertId]
  );
  return booking;
};
import connection from '../config/db';

export interface Booking {
  id: number;
  user_id: number;
  service: string;
  date: string;
  time: string;
  price: number;
  status: string;
  created_at: string;
}

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

export const confirmBooking = async (bookingId: number, userId: number): Promise<void> => {
  const res = await executeQuery<any[]>(
    'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = "marcado"',
    [bookingId, userId]
  );
  if (!res.length) throw { status: 404, message: 'Agendamento não encontrado ou já confirmado' };
  await executeQuery('UPDATE bookings SET status = "confirmado" WHERE id = ?', [bookingId]);
};
