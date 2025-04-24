import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from '../services/auth.service';

// Register a new user
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await AuthService.register(req.body);
    
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400);
    throw error;
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
    res.status(401);
    throw error;
  }
});

// Refresh token
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401);
    throw error;
  }
});

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
    res.status(400);
    throw error;
  }
}); 