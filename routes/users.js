import express from 'express';
import { findUserById } from '../controller/userController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users Routes');
})
router.get('/:id', findUserById);
router.post('/login', (req, res) => {
  res.send('Login function');
});
router.post('/signup', (req, res) => {
  res.send('SignUp function');
});

export default router;