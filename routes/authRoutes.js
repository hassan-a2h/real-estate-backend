import express from 'express';
const router = express.Router();
import { registerUser, authUser, logoutUser, checkAuth } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/check-auth', checkAuth);

export default router;
