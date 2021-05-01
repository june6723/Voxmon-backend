import express from 'express';
import { registerUser } from '../controller/Auth.controller.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', async (req, res, next) => {
  res.send('login route')
})
router.post('/refresh-token', async (req, res, next) => {
  res.send('refresh token route')
})
router.delete('/logout', async (req, res, next) => {
  res.send('logout route')
})

export default router;