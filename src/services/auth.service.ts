
import jwt from 'jsonwebtoken';
import connection from '../config/db';

/**
 * Interface dos dados para registro de usuário.
 */
interface RegisterData {
  name: string;
  email: string;
  password: string;
  number: string;
  age: number;
}

/**
 * Interface do payload do token JWT.
 */
interface TokenPayload {
  id: number;
  email: string;
}

/**
 * Tipo para erros de serviço.
 */
type ServiceError = {
  status: number;
  message: string;
};

/**
 * Cria um token JWT para o usuário autenticado.
 * @param payload Dados do usuário
 * @returns Token JWT
 */
const createToken = (payload: TokenPayload): string => {
  console.log('PAYLOAD PARA TOKEN:', payload);
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
};

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
 * Registra um novo usuário no banco de dados e retorna um token JWT.
 * @param data Dados do usuário
 * @returns Token JWT
 */
export const registerUser = async (data: RegisterData): Promise<string> => {
  const existing = await executeQuery<any[]>('SELECT * FROM users WHERE email = ?', [data.email]);
  if (existing.length > 0) {
    throw { status: 400, message: 'Email já cadastrado' } as ServiceError;
  }
  const result = await executeQuery<any>(
    'INSERT INTO users (name, email, password, number, age) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.email, data.password, data.number, data.age]
  );
  return createToken({ id: result.insertId, email: data.email });
};

/**
 * Realiza o login do usuário e retorna um token JWT.
 * @param email Email do usuário
 * @param password Senha do usuário
 * @returns Token JWT
 */
export const loginUser = async (email: string, password: string): Promise<string> => {
  const results = await executeQuery<any[]>('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
  if (results.length === 0) {
    throw { status: 404, message: 'Usuário ou senha incorretos' } as ServiceError;
  }
  const user = results[0];
  return createToken({ id: user.id, email: user.email });
};
