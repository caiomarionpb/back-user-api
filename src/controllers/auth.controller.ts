// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { loginUser, registerUser, loginBarber as loginBarberService } from '../services/auth.service';
import { getUserProfileById, updateUserProfile } from '../services/user.service';

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
 * Controller para registrar novo usuário.
 * Espera name, email, password, number e age no body.
 * Retorna token JWT ao registrar.
 */
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

/**
 * Controller para autenticação de usuário.
 * Espera email e password no body.
 * Retorna token JWT ao autenticar.
 */
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

/**
 * Controller para autenticação de barbeiro.
 * Espera email e password no body.
 * Retorna token JWT ao autenticar.
 */
export const loginBarber = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }
  try {
    const token = await loginBarberService(email, password);
    return res.json({ token });
  } catch (error) {
    return sendServiceError(res, error, 'Erro ao autenticar barbeiro');
  }
};

/**
 * Controller para buscar dados do perfil do usuário autenticado.
 */
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

/**
 * Controller para atualizar dados do perfil do usuário autenticado.
 */
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