import { Router } from 'express';
import { Banner } from '../models/Banner.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  }),
);

router.use(requireAuth, requireRole(...STAFF_ROLES));

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) throw new ApiError(404, 'Banner not found.');
    res.json(banner);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

export default router;
