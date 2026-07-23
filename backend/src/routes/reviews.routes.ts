import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { deleteReview, listReviews, moderateReview } from '../controllers/reviewController.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/', asyncHandler(listReviews));
router.patch('/:id/status', asyncHandler(moderateReview));
router.delete('/:id', asyncHandler(deleteReview));

export default router;
