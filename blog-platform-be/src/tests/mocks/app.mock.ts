import express from 'express';
import cors from 'cors';
import authRoutes from '../../routes/authRoutes';
import postRoutes from '../../routes/postRoutes';
import commentRoutes from '../../routes/commentRoutes';
import { notFound, errorHandler } from '../../middleware/errorMiddleware';

// Create a test Express app without database connection checks
export const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: false,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Welcome route
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Blog Platform API',
      version: '1.0.0',
    });
  });

  // API Routes - following the same structure as in index.ts
  app.use('/auth', authRoutes);
  app.use('/posts', postRoutes);
  app.use('/posts', commentRoutes);

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
