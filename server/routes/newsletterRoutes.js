import express from 'express';
import { subscribeNewsletter } from '../controllers/newsletterController.js';

const router = express.Router();

// Public endpoint for storefront newsletter subscription
router.post('/subscribe', subscribeNewsletter);

export default router;
