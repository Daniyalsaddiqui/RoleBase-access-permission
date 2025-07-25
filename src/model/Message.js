import { pool } from '../config/db.js';

// Save a message
export const createMessage = async ({ fromUserId, toUserId, message, type = 'text', fileName = null }) => {
  const [result] = await pool.execute(
    `INSERT INTO messages (from_user_id, to_user_id, message, type, file_name)
     VALUES (?, ?, ?, ?, ?)`,
    [fromUserId, toUserId, message, type, fileName]
  );

  const insertedId = result.insertId;

  const [rows] = await pool.execute(`SELECT * FROM messages WHERE id = ?`, [insertedId]);
  return rows[0];
};

// Get conversation between two users (admin + user)
export const getConversation = async (userA, userB) => {
  const [rows] = await pool.execute(
    `SELECT * FROM messages
     WHERE (from_user_id = ? AND to_user_id = ?)
        OR (from_user_id = ? AND to_user_id = ?)
     ORDER BY created_at ASC`,
    [userA, userB, userB, userA]
  );
  return rows;
};

// Get distinct users who messaged admin
export const getAllSendersToAdmin = async (adminId) => {
  const [rows] = await pool.execute(
    `SELECT DISTINCT from_user_id
     FROM messages
     WHERE to_user_id = ?`,
    [adminId]
  );
  return rows.map((row) => row.from_user_id);
};

// Get last message from each user to admin
export const getLastMessagesToAdmin = async (adminId) => {
  const [rows] = await pool.execute(
    `SELECT m.*
     FROM messages m
     INNER JOIN (
       SELECT from_user_id, MAX(created_at) AS last_time
       FROM messages
       WHERE to_user_id = ?
       GROUP BY from_user_id
     ) sub ON m.from_user_id = sub.from_user_id AND m.created_at = sub.last_time
     ORDER BY m.created_at DESC`,
    [adminId]
  );
  return rows;
};
