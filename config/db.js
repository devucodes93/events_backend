import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "eventdb",
  password: "Devendra@123",
  port: 5432,
});

export default pool;
