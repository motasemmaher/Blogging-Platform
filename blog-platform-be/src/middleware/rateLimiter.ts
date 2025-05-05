import rateLimit from 'express-rate-limit';
import config from '../config';

const { WINDOW_MS, MAX_REQUESTS, STANDARDIZE_HEADERS, LEGACY_HEADERS } = config.RATE_LIMIT;

/**
 * General API rate limiter
 * Limits the number of requests a user can make within a time window
 */
export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  standardHeaders: STANDARDIZE_HEADERS,
  legacyHeaders: LEGACY_HEADERS,
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
});

/**
 * More restrictive rate limiter for authentication routes
 * Helps prevent brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 failed attempts per windowMs
  standardHeaders: STANDARDIZE_HEADERS, 
  legacyHeaders: LEGACY_HEADERS,
  skipSuccessfulRequests: true, // Only count failed requests
  message: {
    status: 429,
    message: 'Too many login attempts, please try again later.',
  },
});

/**
 * Function to create custom rate limiters for specific routes or needs
 */
export const createCustomLimiter = (
  windowMs: number = 60 * 1000, // 1 minute by default
  max: number = 10, // 10 requests by default
  message: string = 'Rate limit exceeded'
) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: STANDARDIZE_HEADERS,
    legacyHeaders: LEGACY_HEADERS,
    message: {
      status: 429,
      message,
    },
  });
}; 