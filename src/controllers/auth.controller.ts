// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { getUserProfileById, updateUserProfile } from '../services/user.service';

const sendServiceError = (res: Response, error: unknown, defaultMessage: string) => {
  if (error && typeof error === 'object' && 'status' in error) {
    const { status, message } = error as { status: number; message: string };
    return res.status(status).json({ error: message });
  }

  return res.status(500).json({ error: defaultMessage });
};

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { name, email, password, number, age } = req.body;

  if (!name || !email || !password || !number || !age) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const token = await registerUser({ name, email, password, number, age });
    return res.json({ token });
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao registrar usuário');
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }

  try {
    const token = await loginUser(email, password);
    return res.json({ token });
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao autenticar');
  }
};

// PROFILE
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

// UPDATE PROFILE
export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { name, number, age } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (!name || !number || !age) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    await updateUserProfile(userId, name, number, age);
    return res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao atualizar perfil');
  }
};