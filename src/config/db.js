// src/config/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
console.log(
  'Connecting to MySQL database with the following credentials:',
  process.env.HOST_NAME, 
  process.env.USER, 
  process.env.PASS, 
  process.env.DATABASE_NAME
);  


export const pool = mysql.createPool({
  host: process.env.HOST_NAME,
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE_NAME,
  port: 3306,
  queueLimit: 0,
});
export const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successfully.');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};
