import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Server configuration
const SERVER = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Database configuration
const DATABASE = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT || '5432', 10),
  NAME: process.env.DB_NAME || 'blogdb',
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || '',
  URL: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};

// JWT configuration
const JWT = {
  SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key',
  EXPIRE: process.env.JWT_EXPIRE || '1h',
  REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
};

// CORS configuration
const CORS = {
  ORIGIN: process.env.CORS_ORIGIN || '*',
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
  CREDENTIALS: false,
};

// Export configuration
const config = {
  SERVER,
  DATABASE,
  JWT,
  CORS,
};

export default config; 