import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole, STAFF_ROLES } from '../middleware/auth.js';
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  toggleCouponStatus,
  updateCoupon,
  validateCoupon,
} from '../controllers/couponController.js';

const router = Router();

router.post('/validate', requireAuth, asyncHandler(validateCoupon));

router.use(requireAuth, requireRole(...STAFF_ROLES));

router.get('/', asyncHandler(listCoupons));
router.post('/', asyncHandler(createCoupon));
router.put('/:id', asyncHandler(updateCoupon));
router.delete('/:id', asyncHandler(deleteCoupon));
router.patch('/:id/toggle', asyncHandler(toggleCouponStatus));

export default router;
