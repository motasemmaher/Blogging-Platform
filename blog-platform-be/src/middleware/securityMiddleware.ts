import helmet from 'helmet';
import { Express } from 'express';
import config from '../config';

/**
 * Configure and apply security middleware to Express application
 * Sets up HTTP security headers and other security measures
 * 
 * @param app Express application
 */
export const setupSecurityMiddleware = (app: Express): void => {
  // Apply helmet middleware with custom CSP settings
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: config.SECURITY.CONTENT_SECURITY_POLICY.directives,
      },
      // Set strict transport security header in production
      ...(config.SERVER.IS_PRODUCTION && {
        hsts: {
          maxAge: 31536000, // 1 year in seconds
          includeSubDomains: true,
          preload: true,
        },
      }),
      // Disable X-Powered-By header to prevent attackers from detecting the framework
      hidePoweredBy: true,
      // Prevent clickjacking attacks by setting X-Frame-Options
      frameguard: {
        action: 'deny',
      },
      // Prevent MIME type sniffing
      noSniff: true,
      // Set XSS protection headers
      xssFilter: true,
    })
  );

  // Add CORS headers if CORS is enabled in config
  if (config.SECURITY.CORS_ENABLED) {
    app.use((req, res, next) => {
      // Set Cache-Control header to prevent sensitive information from being cached
      if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      next();
    });
  }

  console.log('🔒 Security middleware configured');
}; 