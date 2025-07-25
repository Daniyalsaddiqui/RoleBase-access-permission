// All other imports stay the same
import { createMessage, getConversation, getAllSendersToAdmin, getLastMessagesToAdmin } from '../model/Message.js';
import { findUserById, findAdminUser } from '../model/User.js';
import { pool } from '../config/db.js';

// Send a message (user to admin or admin to user)
export const sendMessage = async (req, res) => {
  try {
    const { fromUserId, toUserId, message, type = 'text', fileName = null } = req.body;

    if (!fromUserId || !toUserId || !message) {
      return res.status(400).send({ 
        message: 'Missing required fields' 
      });
    }

    const fromUser = await findUserById(fromUserId);
    const toUser = await findUserById(toUserId);

    if (!fromUser || !toUser) {
      return res.status(404).send({ 
        message: 'User not found' 
      });
    }

    const savedMessage = await createMessage({
      fromUserId,
      toUserId,
      message,
      type,
      fileName
    });

    res.status(200).send({
      message: 'Message sent successfully',
      data: savedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).send({ 
      message: 'Server error', 
      error: error.message });
  }
};

// Get conversation between two users
export const getConversationHistory = async (req, res) => {
  try {
    const { userA, userB } = req.params;

    if (!userA || !userB) {
      return res.status(400).send({ 
        message: 'Both user IDs are required' 
      });
    }

    const conversation = await getConversation(userA, userB);

    res.status(200).send({
      message: 'Conversation retrieved successfully',
      data: conversation
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).send({
       message: 'Server error', 
       error: error.message 
      });
  }
};

// Get all users who have messaged admin (for admin dashboard)
export const getUsersForAdmin = async (req, res) => {
  try {
    const admin = await findAdminUser();
    if (!admin) {
      return res.status(404).send({ 
        message: 'Admin user not found' 
      });
    }

    const lastMessages = await getLastMessagesToAdmin(admin.id);

    const usersWithMessages = await Promise.all(
      lastMessages.map(async (msg) => {
        const user = await findUserById(msg.from_user_id);
        return {
          userId: user.id,
          username: user.username,
          email: user.email,
          lastMessage: msg.message,
          lastMessageTime: msg.created_at,
          unreadCount: 0
        };
      })
    );

    res.status(200).send({
      message: 'Users find successfully',
      data: usersWithMessages
    });
  } catch (error) {
    console.error('Get users for admin error:', error);
    res.status(500).send({ 
      message: 'Server error', 
      error: error.message });
  }
};

// Get admin user info
export const getAdminInfo = async (req, res) => {
  try {
    const admin = await findAdminUser();
    if (!admin) {
      return res.status(404).send({ 
        message: 'Admin user not found' 
      });
    }

    res.status(200).send({
      message: 'Admin info find successfully',
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Get admin info error:', error);
    res.status(500).send({ 
      message: 'Server error', 
      error: error.message });
  }
};

// Get all user chats with admin
export const getAllUserChatsWithAdmin = async (req, res) => {
  try {
    const admin = await findAdminUser();
    if (!admin) return res.status(404).send({ 
      message: 'Admin not found' 
    });

    const [rows] = await pool.execute(
      `SELECT DISTINCT from_user_id AS user_id FROM messages WHERE to_user_id = ?
       UNION
       SELECT DISTINCT to_user_id AS user_id FROM messages WHERE from_user_id = ?`,
      [admin.id, admin.id]
    );

    const userIds = rows.map(row => row.user_id).filter(id => id !== admin.id);

    const chatData = await Promise.all(userIds.map(async (userId) => {
      const user = await findUserById(userId);
      const conversation = await getConversation(admin.id, userId);
      const lastMessage = conversation[conversation.length - 1];
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        lastMessage: lastMessage?.message || '',
        conversation
      };
    }));

    res.status(200).send({
      message: 'All user chats with admin',
      data: chatData
    });
  } catch (error) {
    console.error('Error getting all admin chats:', error);
    res.status(500).send({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
