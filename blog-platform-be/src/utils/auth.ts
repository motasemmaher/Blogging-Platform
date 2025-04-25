import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import 'dotenv/config';

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET environment variables are required');
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password with hashed password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

interface AccessTokenPayload {
  id: number;
  email: string;
  role: string;
}

interface RefreshTokenPayload {
  id: number;
}

// Generate JWT access token
export const generateAccessToken = (userId: number, email: string, role: string): string => {
  const payload: AccessTokenPayload = { id: userId, email, role };
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn: Number(process.env.JWT_EXPIRE) || '1h' };

  return jwt.sign(payload, secret, options);
};

// Generate JWT refresh token
export const generateRefreshToken = (userId: number): string => {
  const payload: RefreshTokenPayload = { id: userId };
  const secret = process.env.JWT_REFRESH_SECRET as string;
  const options: SignOptions = { expiresIn: Number(process.env.JWT_REFRESH_EXPIRE) || '7d' };

  return jwt.sign(payload, secret, options);
};

// Verify JWT token
export const verifyToken = (token: string, isRefreshToken: boolean = false): JwtPayload => {
  const secret = isRefreshToken
    ? (process.env.JWT_REFRESH_SECRET as string)
    : (process.env.JWT_SECRET as string);

  return jwt.verify(token, secret) as JwtPayload;
};
