import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { createRole, deleteRole, listPermissions, listRoles, updateRole } from '../controllers/roleController.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/', asyncHandler(listRoles));
router.get('/permissions', listPermissions);
router.post('/', asyncHandler(createRole));
router.put('/:id', asyncHandler(updateRole));
router.delete('/:id', asyncHandler(deleteRole));

export default router;
