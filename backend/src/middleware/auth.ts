import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { unauthorized, forbidden } from '../utils/response';

interface TokenPayload {
  sub: string;
  role: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    unauthorized(res);
    return;
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    req.user = { id: payload.sub, role: payload.role as 'user' | 'premium' | 'admin' | 'superadmin', device_id: payload.deviceId };
    next();
  } catch {
    unauthorized(res, 'Invalid or expired token');
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      forbidden(res, 'Insufficient permissions');
      return;
    }
    next();
  };
}

export const requireAdmin = requireRole('admin', 'superadmin');
