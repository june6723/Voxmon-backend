import express, { response } from 'express';
import { acceptFriendRequest, findUserById, findUsers, findUsersWhileSearching, getUserFriends, sendFriendRequest } from '../controller/User.controller.js';
import auth from '../middleware/Auth.middleware.js'

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Users Routes');
})
router.get('/find', findUsers)
router.get('/searching/:username', findUsersWhileSearching)
router.get('/:id', findUserById);

router.get('/friends', auth, getUserFriends)
router.post('/friend-req/:id', auth, sendFriendRequest)
router.post('/friend-acc/:id', auth, acceptFriendRequest)

export default router;