interface MockCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
}

export const MOCK_COUPONS: MockCoupon[] = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minOrderValue: 999 },
  { code: 'FLAT200', type: 'fixed', value: 200, minOrderValue: 1999 },
];

export interface CouponResult {
  code: string;
  discount: number;
}

export function validateMockCoupon(code: string, subtotal: number): CouponResult {
  const coupon = MOCK_COUPONS.find((c) => c.code === code.trim().toUpperCase());
  if (!coupon) throw new Error('Invalid coupon code.');
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    throw new Error(`A minimum order value of ₹${coupon.minOrderValue} is required for this coupon.`);
  }
  const discount = coupon.type === 'percentage' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  return { code: coupon.code, discount: Math.min(discount, subtotal) };
}
