import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT auth protection middleware to all cart routes
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/update/:productId', updateCartItem);
router.patch('/:productId', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/remove/:productId', removeFromCart);
router.delete('/:productId', removeFromCart);

export default router;
