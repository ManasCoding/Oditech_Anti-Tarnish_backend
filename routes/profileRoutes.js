import express from 'express';
import { getProfile, updateProfile, updateAvatar } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/cloudinary.js';

const router = express.Router();

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

export default router;
