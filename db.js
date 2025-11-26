import mysql from "mysql2/promise";

// Read DB config from environment with sensible fallbacks.
// Ensure you set these in a `.env` file at the backend root (server loads dotenv).
const dbConfig = {
  host: process.env.DB_HOST || "srv1992.hstgr.io",
  user: process.env.DB_USER || "u143310791_root",
  password: process.env.DB_PASSWORD || "Palmclinic@1234",
  database: process.env.DB_NAME || "u143310791_palmclinic",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT ? Number(process.env.DB_CONN_LIMIT) : 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Test connection immediately
pool.getConnection()
  .then((conn) => {
    console.log("✅ Connected to MySQL database");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

export default pool;
