import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getStore,
  updateStore,
  updateStoreField
} from '../controllers/storeController.js';

const router = express.Router();

router.get('/my-store', authenticateToken, getStore);
router.put('/my-store', authenticateToken, updateStore);
router.patch('/my-store', authenticateToken, updateStoreField); // For partial updates

export default router;

