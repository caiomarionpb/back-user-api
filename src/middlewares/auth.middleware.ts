import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: number;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // verifica se existe header
  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  // verifica formato: Bearer token
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    // garante que tem id
    if (!decoded.id) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    // injeta no request
    (req as any).user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
  console.log('HEADER:', req.headers.authorization);
};
