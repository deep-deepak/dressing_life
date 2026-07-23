import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/', asyncHandler(getSettings));
router.put('/', asyncHandler(updateSettings));

export default router;
