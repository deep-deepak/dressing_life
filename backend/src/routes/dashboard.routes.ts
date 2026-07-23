import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import {
  getCategoryBreakdown,
  getDashboardStats,
  getRecentOrders,
  getSalesTrend,
} from '../controllers/dashboardController.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/stats', asyncHandler(getDashboardStats));
router.get('/sales-trend', asyncHandler(getSalesTrend));
router.get('/category-breakdown', asyncHandler(getCategoryBreakdown));
router.get('/recent-orders', asyncHandler(getRecentOrders));

export default router;
