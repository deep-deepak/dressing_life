import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { computeCategoryBreakdown, computeCustomerGrowth, computeSalesTrend } from '../utils/analytics.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get(
  '/sales',
  asyncHandler(async (_req, res) => {
    res.json(await computeSalesTrend());
  }),
);

router.get(
  '/category',
  asyncHandler(async (_req, res) => {
    res.json(await computeCategoryBreakdown());
  }),
);

router.get(
  '/customer-growth',
  asyncHandler(async (_req, res) => {
    res.json(await computeCustomerGrowth());
  }),
);

export default router;
