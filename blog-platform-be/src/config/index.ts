import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Environment schema validation
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  
  // Database connection - prioritize connection string
  DATABASE_URL: Joi.string().description('PostgreSQL connection string'),
  
  // Individual database parameters (used as fallback)
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string(),
  DB_USER: Joi.string(),
  DB_PASSWORD: Joi.string(),
  
  // Other configs
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.string().default('1h'),
  JWT_REFRESH_EXPIRE: Joi.string().default('7d'),
  CORS_ORIGIN: Joi.string().default('*'),
}).unknown();

// Custom validation to ensure at least one database connection approach is provided
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Ensure that either DATABASE_URL or all individual DB params are provided
if (!envVars.DATABASE_URL && (!envVars.DB_NAME || !envVars.DB_USER)) {
  throw new Error('Database configuration is incomplete. Provide either DATABASE_URL or all individual DB parameters');
}

// Server configuration
const SERVER = {
  PORT: parseInt(envVars.PORT || '3001', 10),
  NODE_ENV: envVars.NODE_ENV || 'development',
  IS_PRODUCTION: envVars.NODE_ENV === 'production',
};

// Database configuration
const DATABASE = {
  // Prioritize connection string if available
  URL: envVars.DATABASE_URL || buildConnectionString(envVars),
  
  // Keep individual parameters for reference
  HOST: envVars.DB_HOST || 'localhost',
  PORT: parseInt(envVars.DB_PORT || '5432', 10),
  NAME: envVars.DB_NAME,
  USER: envVars.DB_USER,
  PASSWORD: envVars.DB_PASSWORD,
};

// Build connection string from individual parameters
function buildConnectionString(env: typeof envVars): string {
  if (!env.DB_NAME || !env.DB_USER) {
    return '';
  }
  
  const password = env.DB_PASSWORD ? `:${env.DB_PASSWORD}` : '';
  return `postgresql://${env.DB_USER}${password}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
}

// JWT configuration
const JWT = {
  SECRET: envVars.JWT_SECRET || 'your_jwt_secret_key',
  REFRESH_SECRET: envVars.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key',
  EXPIRE: envVars.JWT_EXPIRE || '1h',
  REFRESH_EXPIRE: envVars.JWT_REFRESH_EXPIRE || '7d',
};

// CORS configuration
const CORS = {
  ORIGIN: envVars.CORS_ORIGIN || '*',
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
  CREDENTIALS: false,
};

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
  STANDARDIZE_HEADERS: true,
  LEGACY_HEADERS: false, // use modern RFC headers
};

// Security settings
const SECURITY = {
  BCRYPT_ROUNDS: 12,
  CORS_ENABLED: true,
  CONTENT_SECURITY_POLICY: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
};

// Export configuration
const config = {
  SERVER,
  DATABASE,
  JWT,
  CORS,
  RATE_LIMIT,
  SECURITY,
};

export default config; 