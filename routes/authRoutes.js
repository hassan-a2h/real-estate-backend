import express from 'express';
const router = express.Router();
import { registerUser, authUser, logoutUser, checkAuth, getAgents, getUser } from '../controllers/authController.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/check-auth', checkAuth);
router.get('/agents', getAgents);
router.get('/:id', getUser);

export default router;
