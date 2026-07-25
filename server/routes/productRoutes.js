import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  toggleFeaturedProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Product Routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

// Protected Admin Product Routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, admin, updateProductStock);
router.patch('/:id/featured', protect, admin, toggleFeaturedProduct);

export default router;
