import express from 'express';
import { logIn, registerUser } from '../controller/Auth.controller.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', logIn)
router.post('/refresh-token', async (req, res, next) => {
  res.send('refresh token route')
})
router.delete('/logout', async (req, res, next) => {
  res.send('logout route')
})

export default router;