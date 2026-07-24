import { Pool, PoolClient } from 'pg';

const globalForPg = global as unknown as { pool: Pool };

export const pool =
  globalForPg.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

// Setup pool error handling to prevent application crashes on idle client failures
if (!globalForPg.pool) {
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    // Don't process.exit(), let the pool attempt to reconnect/recover
  });
}

if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: DATABASE_URL is not set.');
}

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res.rows as T[];
  } catch (error: any) {
    console.error('Database query error:', {
      text,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
