import { Router } from 'express';
import { Review } from '../models/Review.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  }),
);

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!review) throw new ApiError(404, 'Review not found.');
    res.json(review);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

export default router;
