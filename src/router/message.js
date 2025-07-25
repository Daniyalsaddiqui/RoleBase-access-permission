import express from 'express';
import { 
  sendMessage, 
  // getConversationHistory, 
  getUsersForAdmin, 
  getAdminInfo ,
  getAllUserChatsWithAdmin
} from '../controller/Message_controller.js';

const router = express.Router();

// Send a message
router.post('/send', sendMessage);


// Get all users who have messaged admin (admin dashboard)
router.get('/admin/users', getUsersForAdmin);

// Get admin user info
router.get('/admin/info', getAdminInfo);


// get all user history
router.get('/admin/conversations/all', getAllUserChatsWithAdmin);


// Get conversation between two users
// router.get('/conversation/:userA/:userB', getConversationHistory);





export default router;





