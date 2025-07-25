import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export const createUser = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.execute(
    `INSERT INTO users (username, email, password)
     VALUES (?, ?, ?)`,
    [username, email, hashedPassword]
  );
  
  const [rows] = await pool.execute(
    `SELECT id, username, email, role FROM users WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return rows[0];
};

export const findUserByUsername = async (username) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
  return rows[0];
};

export const findUserById = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE id = ?`,
    [userId]
  );
  return rows[0];
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const findAdminUser = async () => {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE role = ? LIMIT 1`,
    ['admin']
  );
  return rows[0];
};


export const getAllUsers = async () => {
  const [rows] = await pool.execute(
    `SELECT id, username, email, role, created_at FROM users ORDER BY created_at ASC`
  );
  return rows;
};
