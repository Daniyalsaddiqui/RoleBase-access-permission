// src/setup/createTables.js
import { pool } from '../config/db.js';

export const createTables = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await pool.query(`
       CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        from_user_id INT,
        to_user_id INT,
        message TEXT,
        type ENUM('text', 'image', 'file') DEFAULT 'text',
        file_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_user_id) REFERENCES users(id),
        FOREIGN KEY (to_user_id) REFERENCES users(id)
    );

`);
    } catch (err) {
        console.error('❌ Failed to create tables:', err.message);
    }
};

