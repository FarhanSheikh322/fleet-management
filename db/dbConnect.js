/********************************************************/
/***** Node Modules *****/
/********************************************************/
const fs = require("fs");
const mysql = require("mysql2/promise"); // Use require instead of import()
const config = require("../config");

const dbConfig = {
  port: config.db.port,
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  debug: config.db.debug || false,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 50,
  connectTimeout: 10000, // 10 seconds
  queueLimit: 0, // Prevent dropping requests
  keepAliveInitialDelay: 10000, // 0 by default.
  enableKeepAlive: true, // false by default.
  ssl: { rejectUnauthorized: false },
};

let pool;

/**
 * Creates a MySQL connection pool if not already created
 */
async function createConnection() {
  try {
    if (!pool) {
      console.log("Creating new database pool");
      pool = await mysql.createPool(dbConfig); // Await the promise-based pool

      // Keep the connection alive by pinging every 1 minute
      setInterval(async () => {
        try {
          const conn = await pool.getConnection();
          await conn.ping();
          conn.release();
        } catch (err) {
          console.error("Ping Error:", err);
        }
      }, 60000); // Runs every 1 min

      // Handle disconnects
      pool.on("error", async (err) => {
        console.error("Database connection error:", err);
        if (
          err.code === "PROTOCOL_CONNECTION_LOST" ||
          err.code === "ECONNRESET"
        ) {
          console.log("Attempting to reconnect...");
          await handleDisconnect();
        }
      });
    }
    return pool;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

/**
 * Handles MySQL disconnections and reconnects
 */
async function handleDisconnect() {
  try {
    if (pool) {
      await pool.end(); // Gracefully close all connections
      console.log("Closed existing database pool");
    }
    pool = await mysql.createPool(dbConfig); // Recreate the pool properly
    console.log("Reconnected to the database successfully");
  } catch (err) {
    console.error("Error reconnecting to the database:", err);
    setTimeout(handleDisconnect, 5000); // Try reconnecting after 5 seconds
  }
}

module.exports = createConnection;
