import { UserModel } from '../models/user.model';
import { TokenModel } from '../models/token.model';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../utils/auth';
import { AppError } from '../utils/AppError';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  // Register a new user
  static async register(userData: RegisterData) {
    // Check if user exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await UserModel.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: 'user',
    });

    if (!user) {
      throw new AppError('Failed to create user', 500);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7); // 7 days from now

    await TokenModel.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expires: expiresDate,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  // Login user
  static async login(loginData: LoginData) {
    // Check if user exists
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await comparePassword(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 7); // 7 days from now

    await TokenModel.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expires: expiresDate,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  // Refresh access token
  static async refreshToken(refreshToken: string) {
    // Check if token exists in database
    const token = await TokenModel.findByToken(refreshToken);
    if (!token) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Check if token is expired
    if (new Date() > token.expires) {
      // Delete expired token
      await TokenModel.deleteById(token.id);
      throw new AppError('Refresh token expired', 401);
    }

    try {
      // Verify token
      verifyToken(refreshToken, true);

      // Get user
      const user = await UserModel.findById(token.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access token
      const newAccessToken = generateAccessToken(user.id, user.email, user.role);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  // Logout user
  static async logout(refreshToken: string) {
    await TokenModel.deleteToken(refreshToken);
    return true;
  }
}
