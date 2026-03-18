import { Request, Response } from 'express';
import connection from '../config/db';

export const getProfile = (req: Request, res: Response) => {
  // req.user foi definido pelo middleware
  const user = (req as any).user;
  res.json({ user });
};

export const getMe = (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const query = 'SELECT id, nome, email, telefone, idade FROM users WHERE id = ?';

  connection.query(query, [userId], (err, results: any) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no banco' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(results[0]);
  });
};

export const createUser = (req: Request, res: Response) => {
  const { nome, email } = req.body;

  return res.status(201).json({
    message: 'Usuário criado',
    user: { nome, email }
  });
};