import type { Order } from '@/types';
import { api } from './api';

export interface CreateRazorpayOrderPayload {
  items: { productId: string; size: string; color: string; quantity: number }[];
  addressId: string;
  couponCode?: string;
}

export interface RazorpayOrderResult {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyRazorpayPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function createRazorpayOrder(payload: CreateRazorpayOrderPayload): Promise<RazorpayOrderResult> {
  const { data } = await api.post<RazorpayOrderResult>('/payments/razorpay/order', payload);
  return data;
}

export async function verifyRazorpayPayment(payload: VerifyRazorpayPayload): Promise<Order> {
  const { data } = await api.post<Order>('/payments/razorpay/verify', payload);
  return data;
}
