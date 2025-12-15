import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems
} from '../controllers/navigationController.js';

const router = express.Router();

router.get('/', authenticateToken, getNavigation);
router.post('/', authenticateToken, createNavigationItem);
router.put('/:navId', authenticateToken, updateNavigationItem);
router.delete('/:navId', authenticateToken, deleteNavigationItem);
router.patch('/reorder', authenticateToken, reorderNavigationItems);

export default router;

