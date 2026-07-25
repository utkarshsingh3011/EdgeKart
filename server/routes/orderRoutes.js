import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// JWT Authentication required on all order routes
router.use(protect);

router.post('/checkout', createOrder);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

export default router;
