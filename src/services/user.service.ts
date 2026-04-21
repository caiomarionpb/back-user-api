
import connection from '../config/db';

/**
 * Tipo para erros de serviço.
 */
type ServiceError = {
  status: number;
  message: string;
};

/**
 * Interface que representa o perfil do usuário.
 */
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  number: string;
  age: number;
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
 * Busca o perfil do usuário pelo ID.
 * @param userId ID do usuário
 * @returns Perfil do usuário
 */
export const getUserProfileById = async (userId: number): Promise<UserProfile> => {
  const results = await executeQuery<any[]>('SELECT id, name, email, number, age FROM users WHERE id = ?', [userId]);
  if (results.length === 0) {
    throw { status: 404, message: 'Usuário não encontrado' } as ServiceError;
  }
  return results[0];
};

/**
 * Atualiza os dados do perfil do usuário.
 * @param userId ID do usuário
 * @param name Novo nome
 * @param number Novo telefone
 * @param age Nova idade
 */
export const updateUserProfile = async (
  userId: number,
  name: string,
  number: string,
  age: number
): Promise<void> => {
  await executeQuery('UPDATE users SET name = ?, number = ?, age = ? WHERE id = ?', [name, number, age, userId]);
};
