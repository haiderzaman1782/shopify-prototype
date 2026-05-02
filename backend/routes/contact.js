import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getContactInfo,
  updateContactInfo
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/', authenticateToken, getContactInfo);
router.put('/', authenticateToken, updateContactInfo);

export default router;

