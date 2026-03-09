import express from 'express';
const router = express.Router();
import { getUsers, deleteUser, upgradeUserSubscription } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getUsers);
router.route('/profile/upgrade').put(protect, upgradeUserSubscription);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;
