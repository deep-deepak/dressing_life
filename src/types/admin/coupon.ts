export type CouponType = 'percentage' | 'fixed';
export type CouponStatus = 'active' | 'expired' | 'scheduled' | 'disabled';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: CouponStatus;
}

export interface CouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
}
