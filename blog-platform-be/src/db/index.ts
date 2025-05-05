import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import config from '../config';
import logger from '../utils/logger';

// Validate database configuration
if (!config.DATABASE.URL) {
  const errorMessage = 'Database connection string is missing';
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.DATABASE.URL,
  // Add additional connection parameters
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a connection to become available
});

// Log connection errors
pool.on('error', (err) => {
  logger.error('Unexpected database error', { error: err.message });
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export a function to check the database connection
export const checkDbConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    client.release();
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed', { 
      error: error instanceof Error ? error.message : String(error),
      connectionString: config.DATABASE.URL.replace(/:[^:@]+@/, ':****@')  // Hide password in logs
    });
    return false;
  }
};
