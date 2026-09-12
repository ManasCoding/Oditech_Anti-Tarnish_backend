import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, createProductReview, getProductReviews } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload, productUpload } from '../middleware/cloudinary.js';

const router = express.Router();

router.get('/', getProducts);

// Review routes must come BEFORE /:slug to avoid wildcard conflict
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createProductReview);

router.get('/:slug', getProductBySlug);
router.post('/', protect, adminOnly, productUpload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, productUpload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
