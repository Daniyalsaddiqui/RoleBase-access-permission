import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  comparePassword,
  getAllUsers,
  findAdminUser,
  findUserById
} from '../model/User.js';

import bcrypt from 'bcrypt';

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ 
        message: 'All fields are required' 
      });
    }

    const existingUser =
      (await findUserByEmail(email)) || (await findUserByUsername(username));

    if (existingUser) {
      return res.status(400).send({ 
        message: 'User already exists' 
      });
    }

    const user = await createUser({ 
      username, 
      email, 
      password 
    });

    res.status(200).send({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send({ 
      message: 'Server error', 
      error: err.message 
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).send({ 
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ 
        message: 'Invalid credentials' });
    }

    res.status(200).send({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).send({ 
      message: 'Server error', 
      error: err.message 
    });
  }
};


// Get all users

export const get_all_users = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).send({
      status: 'success',
      message: 'All users find successfully',
      totalUsers: users.length,
      data: users
  });
  } catch (err) {
    res.status(500).send({ 
      message: 'Server error', 
      error: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Remove password from response
    const { password, ...safeUser } = user;

    return res.status(200).send({
      message: 'User found successfully',
      user: safeUser});  
  } catch (err) {
    return res.status(500).send({
      message: 'Server error',
      error: err.message,
    });
  }
};



// Get admin user
export const findadminUser = async (req, res) => {
  try {
    const admin = await findAdminUser();

    if (!admin) {
      return res.status(404).send({
        message: 'Admin user not found',
      });
    }

    // Only send public info
    const { id, username, email, role, created_at } = admin;

    return res.status(200).send({
      status: 'success',
      message: 'Admin user found',
      Total_User: 1,
      data: { id, username, email, role, created_at }
    });
  } catch (err) {
    return res.status(500).send({
      message: 'Server error',
      error: err.message
    });
  }
};