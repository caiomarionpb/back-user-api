// Confirma agendamento (status = 'confirmado')
export const confirmBooking = async (bookingId: number, userId: number): Promise<void> => {
  // Só permite confirmar se for do usuário e status = 'marcado'
  const res = await executeQuery<any[]>(
    'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = "marcado"',
    [bookingId, userId]
  );
  if (!res.length) throw { status: 404, message: 'Agendamento não encontrado ou já confirmado' };
  await executeQuery('UPDATE bookings SET status = "confirmado" WHERE id = ?', [bookingId]);
};
import connection from '../config/db';

type ServiceError = {
  status: number;
  message: string;
};

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  number: string;
  age: number;
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

export const getUserProfileById = async (userId: number): Promise<UserProfile> => {
  const results = await executeQuery<any[]>('SELECT id, name, email, number, age FROM users WHERE id = ?', [userId]);

  if (results.length === 0) {
    throw { status: 404, message: 'Usuário não encontrado' } as ServiceError;
  }

  return results[0];
};

export const updateUserProfile = async (
  userId: number,
  name: string,
  number: string,
  age: number
): Promise<void> => {
  await executeQuery('UPDATE users SET name = ?, number = ?, age = ? WHERE id = ?', [name, number, age, userId]);
};
