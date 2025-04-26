import express from 'express';
import cors from 'cors';
import { checkDbConnection } from './db';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import config from './config';

// Create Express server
const app = express();
const { PORT } = config.SERVER;

// Middleware
app.use(
  cors({
    origin: config.CORS.ORIGIN,
    methods: config.CORS.METHODS,
    allowedHeaders: config.CORS.ALLOWED_HEADERS,
    credentials: config.CORS.CREDENTIALS,
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
  console.log(`Server running in ${config.SERVER.NODE_ENV} mode on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
