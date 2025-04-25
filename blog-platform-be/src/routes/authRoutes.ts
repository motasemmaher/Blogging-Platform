import express from 'express';
import { register, login, refreshAccessToken, logout } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/authValidators';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRequest(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateRequest(loginSchema), login);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', validateRequest(refreshTokenSchema), refreshAccessToken);

// @route   POST /api/auth/logout
// @desc    Logout user and invalidate refresh token
// @access  Public
router.post('/logout', validateRequest(refreshTokenSchema), logout);

export default router;
