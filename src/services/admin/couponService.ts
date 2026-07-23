import type { Coupon, CouponPayload } from '@/types';
import { api } from '../api';

export async function getCoupons(): Promise<Coupon[]> {
  const { data } = await api.get<Coupon[]>('/coupons');
  return data;
}

export async function createCoupon(payload: CouponPayload): Promise<Coupon> {
  const { data } = await api.post<Coupon>('/coupons', payload);
  return data;
}

export async function updateCoupon(id: string, payload: CouponPayload): Promise<Coupon> {
  const { data } = await api.put<Coupon>(`/coupons/${id}`, payload);
  return data;
}

export async function deleteCoupon(id: string): Promise<void> {
  await api.delete(`/coupons/${id}`);
}

export async function toggleCouponStatus(id: string): Promise<Coupon> {
  const { data } = await api.patch<Coupon>(`/coupons/${id}/toggle`);
  return data;
}
