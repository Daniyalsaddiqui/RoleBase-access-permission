// handleSocketConnection.js
import { findUserById } from './model/User.js';
import { createMessage } from './model/Message.js';

const users = new Map(); // userId → socket

export function handleSocketConnection(socket, io) {
    console.log("🔌 Socket connected:", socket.id);

    // 🔐 Register a user when they join
     socket.on("register", async (data) => {
            try {
                let userId;
    
                // Support both raw string and object
                if (typeof data === 'string') {
                    try {
                        const parsed = JSON.parse(data);
                        userId = parsed.userId;
                    } catch (err) {
                        console.error("❌ JSON parse error:", err.message);
                        return socket.emit("error", { message: "Invalid join payload format" });
                    }
                } else if (typeof data === 'object' && data !== null) {
                    userId = data.userId;
                }
    
                userId = parseInt(userId);
                if (isNaN(userId)) throw new Error("Invalid userId");
    
                const user = await findUserById(userId);
                if (!user) {
                    console.log("❌ Invalid user:", userId);
                    return socket.emit("error", { message: "User not found" });
                }
    
                users.set(userId, socket);
                socket.userId = userId;
    
                socket.emit("user join", userId);
                console.log(`✅ Registered user: ${user.username} (${userId})`);
            } catch (err) {
                console.error("❌ Register error:", err.message);
                socket.emit("error", { message: "Registration failed" });
            }
        });

    // 📩 Handle private messages
  socket.on("privateMessage", async (data) => {
    try {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (err) {
                console.log("❌ Failed to parse JSON:", err);
                return;
            }
        }stat

        const fromUserId = socket.userId;
        const { toUserId, message = null, fileName = null, type = 'text' } = data;

        // 🛡 Validate required fields
        if (!fromUserId || !toUserId || (!message && !fileName)) {
            console.log("❌ Incomplete message payload");
            return;
        }

        // 🧱 Construct message for DB + socket
        const payload = {
            fromUserId,
            toUserId,
            message,
            type,
            fileName,
        };

        // 💾 Save to database
        const savedMessage = await createMessage({
            fromUserId,
            toUserId,
            message,
            type,
            fileName,
        });

        payload.timestamp = savedMessage?.timestamp || payload.timestamp;

        // 📡 Emit to receiver
        const toSocket = users.get(toUserId);
        if (toSocket) toSocket.emit("privateMessage", payload);

        // 🔄 Emit to sender
        const fromSocket = users.get(fromUserId);
        if (fromSocket) fromSocket.emit("privateMessage", payload);

        console.log("📤 Sent message:", payload);
    } catch (err) {
        console.log("❌ Error handling privateMessage:", err.message);
    }
});

    // 🔌 Handle disconnect
    socket.on("disconnect", () => {
        if (socket.userId) {
            users.delete(socket.userId);
            console.log(`❌ Disconnected: ${socket.userId}`);
        }
    });
}
