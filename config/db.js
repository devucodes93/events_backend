import 'dotenv/config';
import { Pool } from 'pg';

const requiredEnvVars = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_DATABASE',
  'POSTGRES_PASSWORD'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`missing required environment variables: ${missingEnvVars}`);
  process.exit(1);
}

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE
});
pool.connect()
  .then(client => {
    console.log("PostgreSQL connected successfully");
    client.release();
  })
  .catch(err => {
    console.log("PostgreSQL connection failed", err);
  });

export default pool;