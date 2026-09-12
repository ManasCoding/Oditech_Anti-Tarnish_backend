import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, updateMyOrderStatus } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/my-status', protect, updateMyOrderStatus);

export default router;
