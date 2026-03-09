import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  getMyArtistSales,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin, artist } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/my-sales').get(protect, artist, getMyArtistSales);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, artist, updateOrderStatus);

export default router;
