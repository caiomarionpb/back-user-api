import { Request, Response } from 'express';
import connection from '../config/db';
import { getUserProfileById } from '../services/user.service';

const sendServiceError = (res: Response, error: unknown, defaultMessage: string) => {
  if (error && typeof error === 'object' && 'status' in error) {
    const { status, message } = error as { status: number; message: string };
    return res.status(status).json({ error: message });
  }

  return res.status(500).json({ error: defaultMessage });
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  try {
    const profile = await getUserProfileById(userId);
    return res.json(profile);
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao buscar perfil');
  }
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