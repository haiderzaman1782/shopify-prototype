import express from 'express';
import { getAllStores, searchProducts, getPublicStore } from '../controllers/marketplaceController.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/stores', getAllStores);
router.get('/search', searchProducts);
router.get('/store/:storeId', getPublicStore);

export default router;

