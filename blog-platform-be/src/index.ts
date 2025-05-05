import express from 'express';
import cors from 'cors';
import config from './config';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { checkDbConnection } from './db';
import { apiLimiter } from './middleware/rateLimiter';
import { setupSecurityMiddleware } from './middleware/securityMiddleware';
import { requestLogger } from './middleware/requestLogger';
import healthCheckRoutes from './middleware/healthCheck';
import { setUser } from './middleware/authMiddleware';
import logger from './utils/logger';

// Server config
const { PORT } = config.SERVER;
const app = express();

// Security middleware
setupSecurityMiddleware(app);

// Request logging middleware
app.use(requestLogger);

// CORS setup
app.use(cors({
  origin: config.CORS.ORIGIN,
  methods: config.CORS.METHODS,
  allowedHeaders: config.CORS.ALLOWED_HEADERS,
  credentials: config.CORS.CREDENTIALS,
}));

// Request rate limiting
app.use('/', apiLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set user middleware - populates req.user if token is present
app.use(setUser);

// Health check routes
app.use('/', healthCheckRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Blog Platform API',
    version: '1.0.0',
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Check database connection before starting server
(async () => {
  const isConnected = await checkDbConnection();
  
  if (!isConnected) {
    logger.error('Database connection failed. Exiting application.');
    process.exit(1);
  }
  
  // Start server
  app.listen(PORT, () => {
    logger.info(`Server running in ${config.SERVER.NODE_ENV} mode on port ${PORT}`);
  });
})();

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection', { error });
  process.exit(1);
});

export default app;
