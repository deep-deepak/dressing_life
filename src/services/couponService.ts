import { api } from './api';

export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
}

export interface ValidateCouponResult {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
}

export async function validateCoupon(payload: ValidateCouponPayload): Promise<ValidateCouponResult> {
  const { data } = await api.post<ValidateCouponResult>('/coupons/validate', payload);
  return data;
}
