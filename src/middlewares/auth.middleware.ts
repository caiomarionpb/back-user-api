import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Interface do payload do token JWT.
 */
interface TokenPayload {
  id: number;
  email: string;
}

/**
 * Middleware de autenticação JWT.
 * Valida o token enviado no header Authorization e injeta o usuário no request.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // LOG: mostrar JWT_SECRET e token recebido
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('HEADER:', authHeader);

  // Verifica se existe header Authorization
  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  // Verifica formato: Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    res.status(401).json({ error: 'Token mal formatado' });
    return;
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ error: 'Token mal formatado' });
    return;
  }

  try {
    // Valida o token JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    // Garante que o token tem id
    if (!decoded.id) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    // Injeta o usuário no request
    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error('ERRO JWT:', error);
    const errMsg = (error && (error as Error).message) ? (error as Error).message : 'Token inválido ou expirado';
    res.status(401).json({ error: errMsg });
  }
};
