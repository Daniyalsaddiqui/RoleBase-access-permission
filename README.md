<<<<<<< HEAD
# RoleBase-access-permission
Socket.IO–based Node.js backend implementing role-based access control (RBAC) with MongoDB persistence.
=======
# Socket1

A Node.js real-time application built with Socket.IO and MongoDB (Mongoose), supporting persistent messaging and role-based users.
Originally implemented with MySQL, this project has now been fully migrated to MongoDB.

🚀 Features

Real-time communication using Socket.IO

MongoDB integration via Mongoose

Persistent message storage

User management with unique usernames

Environment-based configuration

Development-friendly setup with hot reload

## Setup

1. Install dependencies:
   yarn install

2. Copy `.env` and set your environment variables.

3. Start the server:
   yarn dev

4. For development with auto-reload:
   yarn run dev

📁 Project Structure

Socket1/
│
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection logic
│   │
│   ├── models/
│   │   ├── User.js            # User schema (username, email, role)
│   │   └── Message.js         # Message schema
│   │
│   ├── sockets/
│   │   └── socketHandler.js   # Socket.IO event handlers
│   │
│   ├── utils/
│   │   └── function.js        # Shared utility/helper functions
│   │
│   ├── services/
│   │   └── save_message.js    # Message persistence logic
│   │
│   └── server.js              # Main server entry point
│
├── .env                       # Environment variables
├── package.json
├── yarn.lock
└── README.md