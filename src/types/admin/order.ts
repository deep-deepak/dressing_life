import type { OrderItem, OrderStatus, PaymentStatus } from '@/types/order';

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  placedAt: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: string;
}

export type { OrderStatus, PaymentStatus };
