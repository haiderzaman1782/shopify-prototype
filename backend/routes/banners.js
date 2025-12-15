import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';

const router = express.Router();

router.get('/', authenticateToken, getBanners);
router.post('/', authenticateToken, createBanner);
router.put('/:bannerId', authenticateToken, updateBanner);
router.delete('/:bannerId', authenticateToken, deleteBanner);

export default router;

