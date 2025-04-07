/********************************************************/
/***** Node Modules *****/
/********************************************************/
const fs = require('fs');
const mysql = require('mysql2/promise');
const config = require('../config');

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
	queueLimit: 0,         // Prevent dropping requests
	//acquireTimeout: 20000, // 20 seconds
	//timeout: 30000, // 30 seconds for query execution
	keepAliveInitialDelay: 10000, // 0 by default.
	enableKeepAlive: true, // false by default.
	ssl: { ca: fs.readFileSync('./db/certificate.pem') }
};

let pool;

/**
 * Creates a MySQL connection pool if not already created
 */
async function createConnection() {
	try {
		if (!pool) {
			console.log('Creating new database pool');
			pool = mysql.createPool(dbConfig);

			// Keep the connection alive by pinging every 1 minute
			setInterval(() => {
				pool.getConnection()
					.then((conn) => {
						return conn.ping().then(() => conn.release());
					})
					.catch((err) => console.error("Ping Error:", err));
			}, 60000); // Runs every 1 min

			// Handle disconnects
			pool.on('error', async (err) => {
				console.error('Database connection error:', err);
				if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
					console.log('Attempting to reconnect...');
					await handleDisconnect();
				}
			});
		}
		return pool;
	} catch (error) {
		console.error('Error connecting to the database:', error);
		throw error;
	}
}

/**
 * Handles MySQL disconnections and reconnects
 */
async function handleDisconnect() {
	try {
		// pool = mysql.createPool(dbConfig);
		// console.log('Reconnected to the database successfully');

		// Close existing pool (if defined)
		if (pool) {
			await pool.end(); // Gracefully close all connections
			console.log('Closed existing database pool');
		}
		//else {
		// Recreate the pool
		pool = mysql.createPool(dbConfig);
		console.log('Reconnected to the database successfully');
		//}

	} catch (err) {
		console.error('Error reconnecting to the database:', err);
		setTimeout(handleDisconnect, 5000); // Try reconnecting after 5 seconds
	}
}

module.exports = createConnection;
