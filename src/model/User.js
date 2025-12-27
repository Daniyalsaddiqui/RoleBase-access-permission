import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

const mapUser = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    role: doc.role,
    password: doc.password,
    createdAt: doc.createdAt,
    // keep legacy snake_case for compatibility
    created_at: doc.createdAt
  };
};

export const createUser = async ({ username, email, password, role = 'user' }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword, role });
  await user.save();
  return mapUser(user);
};

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();
  return mapUser(user);
};

export const findUserByUsername = async (username) => {
  const user = await User.findOne({ username }).lean();
  return mapUser(user);
};

export const findUserById = async (userId) => {
  if (!userId) return null;
  try {
    const user = await User.findById(userId).lean();
    return mapUser(user);
  } catch (err) {
    return null;
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const findAdminUser = async () => {
  const admin = await User.findOne({ role: 'admin' }).lean();
  return mapUser(admin);
};

export const getAllUsers = async () => {
  const users = await User.find({}, 'username email role createdAt').sort({ createdAt: 1 }).lean();
  return users.map(u => ({
    id: u._id.toString(),
    username: u.username,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    created_at: u.createdAt
  }));
};
