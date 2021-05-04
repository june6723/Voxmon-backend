import express from 'express';
import { logIn, logOut, registerUser, signNewToken } from '../controller/Auth.controller.js';
import verifyAccessToken from '../middleware/Auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', logIn)
router.post('/refresh-token', signNewToken)
router.post('/logout', logOut)

export default router;