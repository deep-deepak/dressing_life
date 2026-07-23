import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { createBanner, deleteBanner, listBanners, updateBanner } from '../controllers/bannerController.js';

const router = Router();

router.get('/', asyncHandler(listBanners));

router.use(requireAuth, requireRole(...STAFF_ROLES));

router.post('/', asyncHandler(createBanner));
router.put('/:id', asyncHandler(updateBanner));
router.delete('/:id', asyncHandler(deleteBanner));

export default router;
