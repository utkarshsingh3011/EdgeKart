import express from 'express';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply JWT auth protection middleware to all wishlist routes
router.use(protect);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
