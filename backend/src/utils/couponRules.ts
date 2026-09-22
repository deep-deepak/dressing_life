import type { Coupon } from '../models/Coupon.js';
import { ApiError } from './asyncHandler.js';

export function deriveStatus(payload: { startDate: string; endDate: string }) {
  const today = new Date().toISOString().slice(0, 10);
  if (today < payload.startDate) return 'scheduled';
  if (today > payload.endDate) return 'expired';
  return 'active';
}

export function resolveCouponDiscount(coupon: InstanceType<typeof Coupon>, subtotal: number): number {
  if (coupon.status === 'disabled') throw new ApiError(400, 'This coupon is disabled.');
  const liveStatus = deriveStatus(coupon);
  if (liveStatus === 'scheduled') throw new ApiError(400, 'This coupon is not active yet.');
  if (liveStatus === 'expired') throw new ApiError(400, 'This coupon has expired.');
  if (coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'This coupon has reached its usage limit.');
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw new ApiError(400, `A minimum order value of ₹${coupon.minOrderValue} is required for this coupon.`);
  }
  const raw = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value;
  return Math.min(Math.round(raw), subtotal);
}
