import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { verifyToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}

export function authRequired(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Требуется токен' });
  try {
    const payload = verifyToken(auth.replace('Bearer ', ''));
    req.user = { id: payload.sub, role: payload.role as Role };
    next();
  } catch {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

export function allowRoles(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Недостаточно прав' });
    next();
  };
}
