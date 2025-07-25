import express from 'express';
import { signup, login,findadminUser, get_all_users,getUserById } from '../controller/Signup_controller.js';
import { findUserById } from '../model/User.js';

const router = express.Router();

router.post('/signup', signup);
router.get('/all-user', get_all_users);
router.get('/user/:id', getUserById);
router.post('/login', login);



// admin api 

router.get('/admin', findadminUser);

export default router;             