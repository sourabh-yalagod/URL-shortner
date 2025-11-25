import { Pool } from "pg";

import { config } from 'dotenv'
config()
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export async function createTable() {
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
    } catch (err) {
        console.error('Error creating table:', err);
    }
};

export async function checkUrlExist(shortCode: string) {
    const result = await pool.query(
        'SELECT original_url FROM urls WHERE short_code = $1',
        [shortCode]
    );
    return result;
}

export async function updateClicks(shortCode: string) {
    await pool.query(
        'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
        [shortCode]
    );
}

export async function findUrlByShortCode(shortCode: string) {
    const result = await pool.query(
        'SELECT * FROM urls WHERE short_code = $1',
        [shortCode]
    );
    return result
}

export async function insertNewShortCode(shortCode: string, url: string) {
    const result = await pool.query(
        'INSERT INTO urls (short_code, original_url) VALUES ($1, $2) RETURNING *',
        [shortCode, url]
    );
    return result
}
