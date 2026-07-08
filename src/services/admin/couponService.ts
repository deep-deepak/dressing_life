import type { Coupon, CouponPayload } from '@/types';
import { ADMIN_COUPONS } from '../mock/admin/coupons.data';
import { simulateDelay } from '../simulateDelay';

function deriveStatus(payload: CouponPayload): Coupon['status'] {
  const today = new Date().toISOString().slice(0, 10);
  if (today < payload.startDate) return 'scheduled';
  if (today > payload.endDate) return 'expired';
  return 'active';
}

export async function getCoupons(): Promise<Coupon[]> {
  return simulateDelay([...ADMIN_COUPONS]);
}

export async function createCoupon(payload: CouponPayload): Promise<Coupon> {
  const newCoupon: Coupon = {
    id: `cp-${crypto.randomUUID().slice(0, 8)}`,
    usedCount: 0,
    status: deriveStatus(payload),
    ...payload,
  };
  ADMIN_COUPONS.unshift(newCoupon);
  return simulateDelay(newCoupon);
}

export async function updateCoupon(id: string, payload: CouponPayload): Promise<Coupon> {
  const index = ADMIN_COUPONS.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Coupon not found.');
  ADMIN_COUPONS[index] = { ...ADMIN_COUPONS[index], ...payload, status: deriveStatus(payload) };
  return simulateDelay(ADMIN_COUPONS[index]);
}

export async function deleteCoupon(id: string): Promise<void> {
  const index = ADMIN_COUPONS.findIndex((c) => c.id === id);
  if (index !== -1) ADMIN_COUPONS.splice(index, 1);
  return simulateDelay(undefined);
}

export async function toggleCouponStatus(id: string): Promise<Coupon> {
  const index = ADMIN_COUPONS.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Coupon not found.');
  const current = ADMIN_COUPONS[index];
  ADMIN_COUPONS[index] = { ...current, status: current.status === 'disabled' ? deriveStatus(current) : 'disabled' };
  return simulateDelay(ADMIN_COUPONS[index]);
}
