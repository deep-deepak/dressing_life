import { Router } from 'express';
import { Settings } from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const settings = await Settings.findOne();
    res.json(settings);
  }),
);

router.put(
  '/',
  asyncHandler(async (req, res) => {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  }),
);

export default router;
