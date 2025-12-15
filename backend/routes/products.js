import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', authenticateToken, getProducts);
router.get('/featured', authenticateToken, getFeaturedProducts);
router.get('/:productId', authenticateToken, getProduct);
router.post('/', authenticateToken, createProduct);
router.put('/:productId', authenticateToken, updateProduct);
router.delete('/:productId', authenticateToken, deleteProduct);

export default router;

