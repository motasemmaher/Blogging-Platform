import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { TokenModel } from '../../../models/token.model';
import * as authUtils from '../../../utils/auth';

// Mock the models and auth utilities
jest.mock('../../../models/user.model');
jest.mock('../../../models/token.model');
jest.mock('../../../utils/auth');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
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

      // Call the service
      const result = await AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      // Assertions
      expect(UserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(authUtils.hashPassword).toHaveBeenCalledWith('password123');
      expect(UserModel.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'user',
      });
      expect(authUtils.generateAccessToken).toHaveBeenCalledWith(1, 'test@example.com', 'user');
      expect(authUtils.generateRefreshToken).toHaveBeenCalledWith(1);
      expect(TokenModel.createRefreshToken).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });

    it('should throw an error if user already exists', async () => {
      // Mock existing user
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });

      // Assertions
      await expect(
        AuthService.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('User already exists');
    });

    it('should throw an error if user creation fails', async () => {
      // Mock return values
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (authUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (UserModel.create as jest.Mock).mockResolvedValue(null);

      // Assertions
      await expect(
        AuthService.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Failed to create user');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
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

      // Call the service
      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      // Assertions
      expect(UserModel.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(authUtils.comparePassword).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(authUtils.generateAccessToken).toHaveBeenCalledWith(1, 'test@example.com', 'user');
      expect(authUtils.generateRefreshToken).toHaveBeenCalledWith(1);
      expect(TokenModel.createRefreshToken).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });

    it('should throw an error if user not found', async () => {
      // Mock return values
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);

      // Assertions
      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error if password is invalid', async () => {
      // Mock return values
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
      });
      (authUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      // Assertions
      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'wrong_password',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('refreshToken', () => {
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

      // Call the service
      const result = await AuthService.refreshToken('refresh_token');

      // Assertions
      expect(TokenModel.findByToken).toHaveBeenCalledWith('refresh_token');
      expect(authUtils.verifyToken).toHaveBeenCalledWith('refresh_token', true);
      expect(UserModel.findById).toHaveBeenCalledWith(1);
      expect(authUtils.generateAccessToken).toHaveBeenCalledWith(1, 'test@example.com', 'user');
      expect(result).toEqual({
        accessToken: 'new_access_token',
      });
    });

    it('should throw an error if token not found', async () => {
      // Mock return values
      (TokenModel.findByToken as jest.Mock).mockResolvedValue(null);

      // Assertions
      await expect(AuthService.refreshToken('invalid_token')).rejects.toThrow('Invalid refresh token');
    });

    it('should throw an error if token is expired', async () => {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1); // 1 day in the past
      
      // Mock return values
      (TokenModel.findByToken as jest.Mock).mockResolvedValue({
        id: 1,
        token: 'refresh_token',
        userId: 1,
        expires: expiredDate,
      });

      // Assertions
      await expect(AuthService.refreshToken('refresh_token')).rejects.toThrow('Refresh token expired');
      expect(TokenModel.deleteById).toHaveBeenCalledWith(1);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Mock return values
      (TokenModel.deleteToken as jest.Mock).mockResolvedValue(true);

      // Call the service
      const result = await AuthService.logout('refresh_token');

      // Assertions
      expect(TokenModel.deleteToken).toHaveBeenCalledWith('refresh_token');
      expect(result).toBe(true);
    });
  });
}); 