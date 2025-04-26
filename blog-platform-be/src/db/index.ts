import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import config from '../config';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.DATABASE.URL,
});

// Create a Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Export a function to check the database connection
export const checkDbConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    client.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};
