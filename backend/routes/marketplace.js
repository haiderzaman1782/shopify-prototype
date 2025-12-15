import express from 'express';
import { getAllStores, searchProducts } from '../controllers/marketplaceController.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/stores', getAllStores);
router.get('/search', searchProducts);

export default router;

