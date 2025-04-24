export const mockAuthUtils = {
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePassword: jest.fn().mockResolvedValue(true),
  generateAccessToken: jest.fn().mockReturnValue('mocked_access_token'),
  generateRefreshToken: jest.fn().mockReturnValue('mocked_refresh_token'),
  verifyToken: jest.fn().mockReturnValue({ userId: 1 }),
}; 