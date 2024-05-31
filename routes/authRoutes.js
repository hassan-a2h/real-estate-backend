import express from 'express';
const router = express.Router();
import { registerUser, authUser, logoutUser } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

export default router;
