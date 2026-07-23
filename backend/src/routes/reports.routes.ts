import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import { getCategoryReport, getCustomerGrowth, getSalesReport } from '../controllers/reportController.js';

const router = Router();
router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/sales', asyncHandler(getSalesReport));
router.get('/category', asyncHandler(getCategoryReport));
router.get('/customer-growth', asyncHandler(getCustomerGrowth));

export default router;
