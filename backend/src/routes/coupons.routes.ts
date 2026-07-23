import { Router } from 'express';
import { Coupon } from '../models/Coupon.js';
import { asyncHandler, ApiError } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

function deriveStatus(payload: { startDate: string; endDate: string }) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < payload.startDate) return 'scheduled';
  if (today > payload.endDate) return 'expired';
  return 'active';
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.create({ ...req.body, status: deriveStatus(req.body) });
    res.status(201).json(coupon);
  }),
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: deriveStatus(req.body) },
      { new: true },
    );
    if (!coupon) throw new ApiError(404, 'Coupon not found.');
    res.json(coupon);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }),
);

router.patch(
  '/:id/toggle',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw new ApiError(404, 'Coupon not found.');
    coupon.status = coupon.status === 'disabled' ? (deriveStatus(coupon) as typeof coupon.status) : 'disabled';
    await coupon.save();
    res.json(coupon);
  }),
);

export default router;
