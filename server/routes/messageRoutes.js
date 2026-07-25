import express from 'express';
import { createMessage } from '../controllers/messageController.js';

const router = express.Router();

// Public endpoint for submitting customer contact messages
router.post('/', createMessage);

export default router;
