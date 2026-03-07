import 'dotenv/config';
import { Pool } from 'pg';


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