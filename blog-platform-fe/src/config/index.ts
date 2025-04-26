/**
 * Frontend Configuration
 * 
 * This file centralizes all environment variables and configuration settings.
 * Instead of accessing process.env directly throughout the app, we use this config object.
 */

// API Configuration
export const API = {
  // Base URL for API requests (e.g., http://localhost:3001)
  URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // Base URL for the frontend (e.g., http://localhost:3000/api)
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/api',
  
  // Timeout for API requests in milliseconds
  TIMEOUT: 15000,
  
  // Whether to include credentials in API requests
  INCLUDE_CREDENTIALS: false,
};

// App Configuration
export const APP = {
  // Application name
  NAME: 'Blog Platform',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Feature flags
  FEATURES: {
    ENABLE_COMMENTS: true,
    ENABLE_CATEGORIES: true,
  },
};

// Auth Configuration
export const AUTH = {
  // Name of the storage key for the access token
  TOKEN_KEY: 'blog_access_token',
  
  // Name of the storage key for the refresh token
  REFRESH_TOKEN_KEY: 'blog_refresh_token',
  
  // Name of the storage key for user data
  USER_KEY: 'blog_user',
};

// Export the configuration as default
const config = {
  API,
  APP,
  AUTH,
};

export default config; 