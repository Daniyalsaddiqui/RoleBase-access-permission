// src/config/db.js (DEPRECATED)
// This file previously created a MySQL pool. The project has been migrated to MongoDB.
// If any code still imports from here, it'll receive an explanatory error to avoid silent failures.

export const pool = null;
export const getConnection = async () => {
  throw new Error('MySQL config is deprecated. Use src/config/mongo.js and Mongoose instead.');
};
