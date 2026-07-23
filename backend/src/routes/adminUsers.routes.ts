import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createAdminUser, deleteAdminUser, listAdminUsers, updateAdminUser } from '../controllers/adminUserController.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/', asyncHandler(listAdminUsers));
router.post('/', asyncHandler(createAdminUser));
router.put('/:id', asyncHandler(updateAdminUser));
router.delete('/:id', asyncHandler(deleteAdminUser));

export default router;
