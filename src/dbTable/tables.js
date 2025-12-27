// src/dbTable/tables.js
import { findAdminUser, createUser } from '../model/User.js';

export const createInitialData = async () => {
  try {
    const admin = await findAdminUser();
    if (!admin) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const email = process.env.ADMIN_EMAIL || 'admin@example.com';
      const password = process.env.ADMIN_PASSWORD || 'admin123';

      const newAdmin = await createUser({ username, email, password, role: 'admin' });
      console.log('✅ Admin user created:', newAdmin.email);
    } else {
      console.log('✅ Admin user already exists:', admin.email);
    }
  } catch (err) {
    console.error('❌ Failed to setup initial data:', err.message);
  }
};

