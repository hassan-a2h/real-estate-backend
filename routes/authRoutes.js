import express from 'express';
const router = express.Router();
import { registerUser, authUser, logoutUser, checkAuth, getAgents } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/check-auth', checkAuth);
router.get('/agents', getAgents);

export default router;
