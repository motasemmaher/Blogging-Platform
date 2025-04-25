import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/AppError';

// Register a new user
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AuthService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw new AppError('User already exists', 400);
  }
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    throw new AppError('Invalid email or password', 401);
  }
});

// Refresh token
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }
);

// Logout
export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    throw new AppError('Failed to logout', 400);
  }
});
