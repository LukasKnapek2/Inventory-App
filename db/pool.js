const { Pool } = require("pg");

// Use connection string for production (Neon), fall back to individual variables for local development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Fallback to individual variables if no connection string
  host: process.env.DATABASE_URL ? undefined : process.env.POSTGRESQL_HOST,
  user: process.env.DATABASE_URL ? undefined : process.env.POSTGRESQL_USER,
  database: process.env.DATABASE_URL ? undefined : process.env.POSTGRESQL_DB,
  password: process.env.DATABASE_URL ? undefined : process.env.POSTGRESQL_PASSWORD,
  port: process.env.DATABASE_URL ? undefined : process.env.POSTGRESQL_PORT,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
