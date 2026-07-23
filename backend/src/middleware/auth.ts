import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/asyncHandler.js';

export interface AuthTokenPayload {
  id: string;
  role: 'customer' | 'support' | 'manager' | 'admin';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    throw new ApiError(401, 'Authentication required.');
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token.');
  }
}

export function requireRole(...roles: AuthTokenPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action.');
    }
    next();
  };
}

export const STAFF_ROLES: AuthTokenPayload['role'][] = ['support', 'manager', 'admin'];
