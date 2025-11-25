"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = createTable;
exports.checkUrlExist = checkUrlExist;
exports.updateClicks = updateClicks;
exports.findUrlByShortCode = findUrlByShortCode;
exports.insertNewShortCode = insertNewShortCode;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
async function createTable() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        clicks INT DEFAULT 0
      )
    `);
        console.log('Table created or already exists');
    }
    catch (err) {
        console.error('Error creating table:', err);
    }
}
;
async function checkUrlExist(shortCode) {
    const result = await pool.query('SELECT original_url FROM urls WHERE short_code = $1', [shortCode]);
    return result;
}
async function updateClicks(shortCode) {
    await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1', [shortCode]);
}
async function findUrlByShortCode(shortCode) {
    const result = await pool.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
    return result;
}
async function insertNewShortCode(shortCode, url) {
    const result = await pool.query('INSERT INTO urls (short_code, original_url) VALUES ($1, $2) RETURNING *', [shortCode, url]);
    return result;
}
//# sourceMappingURL=index.js.map