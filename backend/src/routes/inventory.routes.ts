import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { adjustStock, listInventory } from '../controllers/inventoryController.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/', asyncHandler(listInventory));
router.patch('/:productId/adjust', asyncHandler(adjustStock));

export default router;
