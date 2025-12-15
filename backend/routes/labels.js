import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getLabels,
  getLabel,
  getLabelsByContext,
  createOrUpdateLabel,
  deleteLabel
} from '../controllers/labelController.js';

const router = express.Router();

router.get('/', authenticateToken, getLabels);
router.get('/context/:context', authenticateToken, getLabelsByContext);
router.get('/:labelKey', authenticateToken, getLabel);
router.post('/', authenticateToken, createOrUpdateLabel);
router.put('/:labelKey', authenticateToken, createOrUpdateLabel);
router.delete('/:labelKey', authenticateToken, deleteLabel);

export default router;

