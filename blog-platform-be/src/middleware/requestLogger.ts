import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Request logging middleware
 * Records information about each HTTP request including:
 * - Request method and URL
 * - Response status code
 * - Response time
 * - User agent and IP address
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Record request start time
  const startTime = process.hrtime();
  
  // Add response listener to log after response is sent
  res.on('finish', () => {
    // Calculate response time in milliseconds
    const hrTime = process.hrtime(startTime);
    const responseTimeMs = Math.round(hrTime[0] * 1000 + hrTime[1] / 1000000);
    
    // Log the request details
    logger.request(req, res, responseTimeMs);
  });
  
  next();
}; 