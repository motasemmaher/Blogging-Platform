import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { checkDbConnection } from './db';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

// Create Express server
const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(
  cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false, // Set to false to allow all origins
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check database connection
checkDbConnection()
  .then(connected => {
    if (!connected) {
      console.error('Database connection failed. Exiting application.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

// Welcome route
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Blog Platform API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);
// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server - listen on all network interfaces
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
