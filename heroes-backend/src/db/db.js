import pkg from 'pg';
import { getEnvVar } from '../utils/getEnv.js';

const { Pool } = pkg;

export const pool = new Pool({
  host: getEnvVar('DB_HOST'),
  port: getEnvVar('DB_PORT'),
  user: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD'),
  database: getEnvVar('DB_NAME'),
});

export const postgresConnection = async () => {
  pool
    .connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Database connection error:', err));
};
