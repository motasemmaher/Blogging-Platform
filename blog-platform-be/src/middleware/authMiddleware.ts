import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { JwtPayload } from 'jsonwebtoken';

// Extend the Express Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

export const setUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as JwtPayload;
    // Set user data in request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    next();
  }
}

// Authenticate middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided, authentication required',
      });
      return;
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as JwtPayload;

    // Set user data in request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token, authentication failed',
    });
  }
};

// Authorize middleware factory based on roles
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied, insufficient permissions',
      });
      return;
    }

    next();
  };
};
