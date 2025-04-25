// Mock environment variables
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

// Mock the database connection
jest.mock('../db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  },
  checkDbConnection: jest.fn().mockResolvedValue(true),
}));

// Mock AppError to ensure test compatibility
jest.mock('../utils/AppError', () => {
  class MockAppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
    }
  }

  // This makes instanceof checks work properly
  Object.defineProperty(MockAppError, Symbol.hasInstance, {
    value: (instance: any) => instance && instance.isOperational === true
  });

  return {
    AppError: MockAppError
  };
});

// Monkey patch Express error response for tests
// We need to do this to ensure error responses have the correct format in tests
import express from 'express';

// Override the json method to properly format error responses
const originalJson = express.response.json;
express.response.json = function(this: express.Response, body: any): express.Response {
  if (this.statusCode >= 400 && body instanceof Error) {
    return originalJson.call(this, { message: body.message });
  }
  return originalJson.call(this, body);
};
