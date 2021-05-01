import express, { response } from 'express';
import { findUserById } from '../controller/User.controller.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users Routes');
})
router.get('/find', (req, res) => {
  res.send(`${req.query.name}`);
})
router.get('/:id', findUserById);

export default router;