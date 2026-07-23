import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getRelatedProducts,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', asyncHandler(listProducts));
router.get('/:slug', asyncHandler(getProductBySlug));
router.get('/:id/related', asyncHandler(getRelatedProducts));
router.post('/', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(createProduct));
router.put('/:id', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(updateProduct));
router.delete('/:id', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(deleteProduct));

export default router;
