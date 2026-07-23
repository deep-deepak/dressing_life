import { Router } from 'express';
import { Order } from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { computeCategoryBreakdown, computeDashboardStats, computeSalesTrend } from '../utils/analytics.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    res.json(await computeDashboardStats());
  }),
);

router.get(
  '/sales-trend',
  asyncHandler(async (_req, res) => {
    res.json(await computeSalesTrend());
  }),
);

router.get(
  '/category-breakdown',
  asyncHandler(async (_req, res) => {
    res.json(await computeCategoryBreakdown());
  }),
);

router.get(
  '/recent-orders',
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit ?? 5);
    const orders = await Order.find({}).sort({ placedAt: -1 }).limit(limit);
    res.json(orders);
  }),
);

export default router;
