import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  fileName: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

const mapMsg = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    fromUserId: doc.fromUserId?.toString?.() || doc.fromUserId,
    toUserId: doc.toUserId?.toString?.() || doc.toUserId,
    message: doc.message,
    type: doc.type,
    fileName: doc.fileName,
    createdAt: doc.createdAt,
    // legacy snake_case fields for backward compatibility
    from_user_id: doc.fromUserId?.toString?.() || doc.fromUserId,
    to_user_id: doc.toUserId?.toString?.() || doc.toUserId,
    created_at: doc.createdAt,
    file_name: doc.fileName
  };
};

export const createMessage = async ({ fromUserId, toUserId, message, type = 'text', fileName = null }) => {
  const msg = new Message({
    fromUserId,
    toUserId,
    message,
    type,
    fileName
  });
  await msg.save();
  return mapMsg(msg.toObject());
};

export const getConversation = async (userA, userB) => {
  const conversation = await Message.find({
    $or: [
      { fromUserId: userA, toUserId: userB },
      { fromUserId: userB, toUserId: userA }
    ]
  }).sort({ createdAt: 1 }).lean();

  return conversation.map(mapMsg);
};

export const getAllSendersToAdmin = async (adminId) => {
  const senders = await Message.distinct('fromUserId', { toUserId: adminId });
  return senders.map(s => s.toString());
};

export const getLastMessagesToAdmin = async (adminId) => {
  // For each fromUserId, get the latest message to admin
  const latest = await Message.aggregate([
    { $match: { toUserId: mongoose.Types.ObjectId(adminId) } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$fromUserId',
        doc: { $first: '$$ROOT' }
      }
    },
    { $replaceRoot: { newRoot: '$doc' } },
    { $sort: { createdAt: -1 } }
  ]);

  return latest.map(mapMsg);
};
