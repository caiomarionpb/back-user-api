import jwt from 'jsonwebtoken';
import connection from '../config/db';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  number: string;
  age: number;
}

interface TokenPayload {
  id: number;
  email: string;
}

type ServiceError = {
  status: number;
  message: string;
};

const createToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
};

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

export const loginUser = async (email: string, password: string): Promise<string> => {
  const results = await executeQuery<any[]>('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

  if (results.length === 0) {
    throw { status: 404, message: 'Usuário ou senha incorretos' } as ServiceError;
  }

  const user = results[0];

  return createToken({ id: user.id, email: user.email });
};
