import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getHomepageSections,
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection
} from '../controllers/homepageController.js';

const router = express.Router();

router.get('/', authenticateToken, getHomepageSections);
router.post('/', authenticateToken, createHomepageSection);
router.put('/:sectionId', authenticateToken, updateHomepageSection);
router.delete('/:sectionId', authenticateToken, deleteHomepageSection);

export default router;

