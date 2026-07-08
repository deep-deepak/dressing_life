import type { OrderItem, OrderStatus } from '@/types/user';

export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  placedAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: string;
}

export type { OrderStatus };
