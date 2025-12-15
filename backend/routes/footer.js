import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getFooterSections,
  createFooterSection,
  updateFooterSection,
  deleteFooterSection
} from '../controllers/footerController.js';

const router = express.Router();

router.get('/', authenticateToken, getFooterSections);
router.post('/', authenticateToken, createFooterSection);
router.put('/:footerId', authenticateToken, updateFooterSection);
router.delete('/:footerId', authenticateToken, deleteFooterSection);

export default router;

