import request from 'supertest';
import express from 'express';
import { UserModel } from '../../models/user.model';
import { TokenModel } from '../../models/token.model';
import * as authUtils from '../../utils/auth';
import { createTestApp } from '../mocks/app.mock';

// Mock the models and auth utilities
jest.mock('../../models/user.model');
jest.mock('../../models/token.model');
jest.mock('../../utils/auth');

// Import the app
let app: express.Application;

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Use our test app instead of the real one
    app = createTestApp();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock return values
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (authUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (UserModel.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        password: 'hashed_password',
      });
      (authUtils.generateAccessToken as jest.Mock).mockReturnValue('access_token');
      (authUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');
      (TokenModel.createRefreshToken as jest.Mock).mockResolvedValue({ id: 1 });

      // Make API request
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        });

      // Assertions
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 400 if user already exists', async () => {
      // Mock existing user
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });

      // Make API request
      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        });

      // Assertions
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      // Mock return values
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        password: 'hashed_password',
      });
      (authUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (authUtils.generateAccessToken as jest.Mock).mockReturnValue('access_token');
      (authUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');
      (TokenModel.createRefreshToken as jest.Mock).mockResolvedValue({ id: 1 });

      // Make API request
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should return 401 if user not found', async () => {
      // Mock return value
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);

      // Make API request
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      // Assertions
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 if password is invalid', async () => {
      // Mock return values
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
      });
      (authUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      // Make API request
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong_password',
        });

      // Assertions
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully', async () => {
      const mockDate = new Date();
      mockDate.setDate(mockDate.getDate() + 1); // 1 day in the future
      
      // Mock return values
      (TokenModel.findByToken as jest.Mock).mockResolvedValue({
        id: 1,
        token: 'refresh_token',
        userId: 1,
        expires: mockDate,
      });
      (authUtils.verifyToken as jest.Mock).mockReturnValue({ userId: 1 });
      (UserModel.findById as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        role: 'user',
      });
      (authUtils.generateAccessToken as jest.Mock).mockReturnValue('new_access_token');

      // Make API request
      const response = await request(app)
        .post('/auth/refresh')
        .send({
          refreshToken: 'refresh_token',
        });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken', 'new_access_token');
    });

    it('should return 401 if token is invalid', async () => {
      // Mock return value
      (TokenModel.findByToken as jest.Mock).mockResolvedValue(null);

      // Make API request
      const response = await request(app)
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid_token',
        });

      // Assertions
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid refresh token');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      // Mock return value
      (TokenModel.deleteToken as jest.Mock).mockResolvedValue(true);

      // Make API request
      const response = await request(app)
        .post('/auth/logout')
        .send({
          refreshToken: 'refresh_token',
        });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });
}); 