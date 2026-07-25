import express from 'express';
import { subscribeNewsletter, getNewsletterSubscribers } from '../controllers/newsletterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Storefront newsletter subscription routes
router.post('/', subscribeNewsletter);
router.post('/subscribe', subscribeNewsletter);

// Admin newsletter list route
router.get('/', protect, admin, getNewsletterSubscribers);

export default router;
