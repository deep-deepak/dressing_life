import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { createCategory, deleteCategory, listCategories, updateCategory } from '../controllers/categoryController.js';

const router = Router();

router.get('/', asyncHandler(listCategories));
router.post('/', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(createCategory));
router.put('/:id', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(updateCategory));
router.delete('/:id', requireAuth, requireRole(...STAFF_ROLES), asyncHandler(deleteCategory));

export default router;
