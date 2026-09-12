import express from 'express';
import { getAdmins, createAdmin, deleteAdmin, updateAdminPassword } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAdmins);
router.post('/', protect, adminOnly, createAdmin);
router.delete('/:id', protect, adminOnly, deleteAdmin);
router.put('/:id/password', protect, adminOnly, updateAdminPassword);

export default router;
