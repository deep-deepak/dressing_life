export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';
export type PaymentMethod = 'UPI' | 'Card' | 'Cash on Delivery' | 'Net Banking';

export interface Order {
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
  discount?: number;
  couponCode?: string;
  total: number;
  shippingAddress: string;
}
