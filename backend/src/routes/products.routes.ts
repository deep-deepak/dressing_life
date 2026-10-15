import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getRelatedProducts,
  listProducts,
  updateProduct,
  uploadProductImages,
} from '../controllers/productController.js';

const router = Router();

router.get('/', asyncHandler(listProducts));
router.post(
  '/upload',
  requireAuth,
  requireRole(...STAFF_ROLES),
  upload.array('images', 10),
  asyncHandler(uploadProductImages),
);
router.get('/:slug', asyncHandler(getProductBySlug));
router.get('/:id/related', asyncHandler(getRelatedProducts));
router.post('/', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(createProduct));
router.put('/:id', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(updateProduct));
router.delete('/:id', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(deleteProduct));

export default router;
