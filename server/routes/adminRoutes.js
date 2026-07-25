import express from 'express';
import {
  getDashboardStats,
  getAdminOrders,
  updateOrderStatus,
  deleteAdminOrder,
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  toggleUserBlock,
  deleteAdminUser,
  getAdminMessages,
  getAdminMessageById,
  updateMessageReadStatus,
  updateMessageRepliedStatus,
  deleteAdminMessage,
  getAdminNewsletterSubscribers,
  addAdminNewsletterSubscriber,
  updateAdminNewsletterStatus,
  deleteAdminNewsletterSubscriber,
  getStoreSettings,
  updateStoreSettings
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Dashboard Routes
router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/stats', protect, admin, getDashboardStats);

// Admin Orders Routes
router.get('/orders', protect, admin, getAdminOrders);
router.patch('/orders/:id/status', protect, admin, updateOrderStatus);
router.delete('/orders/:id', protect, admin, deleteAdminOrder);

// Admin Users Routes
router.get('/users', protect, admin, getAdminUsers);
router.get('/users/:id', protect, admin, getAdminUserById);
router.patch('/users/:id/role', protect, admin, updateUserRole);
router.patch('/users/:id/block', protect, admin, toggleUserBlock);
router.delete('/users/:id', protect, admin, deleteAdminUser);

// Admin Messages Routes
router.get('/messages', protect, admin, getAdminMessages);
router.get('/messages/:id', protect, admin, getAdminMessageById);
router.patch('/messages/:id/read', protect, admin, updateMessageReadStatus);
router.patch('/messages/:id/reply', protect, admin, updateMessageRepliedStatus);
router.delete('/messages/:id', protect, admin, deleteAdminMessage);

// Admin Newsletter Routes
router.get('/newsletter', protect, admin, getAdminNewsletterSubscribers);
router.post('/newsletter', protect, admin, addAdminNewsletterSubscriber);
router.patch('/newsletter/:id/status', protect, admin, updateAdminNewsletterStatus);
router.delete('/newsletter/:id', protect, admin, deleteAdminNewsletterSubscriber);

// Admin Settings Routes
router.get('/settings', protect, admin, getStoreSettings);
router.put('/settings', protect, admin, updateStoreSettings);

export default router;
