import type { AdminOrder, OrderItem } from '@/types';
import { PRODUCTS } from '../products.data';

const itemFrom = (productId: string, size: string, color: string, quantity: number): OrderItem => {
  const product = PRODUCTS.find((p) => p.id === productId)!;
  return {
    productId: product.id,
    name: product.name,
    image: product.images[0],
    size,
    color,
    quantity,
    price: product.price,
  };
};

const sum = (items: OrderItem[]) => items.reduce((acc, item) => acc + item.price * item.quantity, 0);

function buildOrder(
  id: string,
  customerName: string,
  customerEmail: string,
  placedAt: string,
  status: AdminOrder['status'],
  paymentStatus: AdminOrder['paymentStatus'],
  paymentMethod: string,
  shippingAddress: string,
  items: OrderItem[],
): AdminOrder {
  const subtotal = sum(items);
  const shippingFee = subtotal >= 2000 ? 0 : 99;
  return {
    id,
    customerName,
    customerEmail,
    placedAt,
    status,
    paymentStatus,
    paymentMethod,
    items,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    shippingAddress,
  };
}

export const ADMIN_ORDERS: AdminOrder[] = [
  buildOrder(
    'ORD-1001',
    'Aditya Rao',
    'aditya.rao@example.com',
    '2026-07-06',
    'delivered',
    'paid',
    'UPI',
    '221 Marine Lines, Mumbai, Maharashtra 400002',
    [itemFrom('p-001', 'L', 'Black', 2), itemFrom('p-003', 'M', 'Black', 1)],
  ),
  buildOrder(
    'ORD-1002',
    'Priya Sharma',
    'priya.sharma@example.com',
    '2026-07-07',
    'shipped',
    'paid',
    'Card',
    '14 Koramangala 5th Block, Bengaluru, Karnataka 560095',
    [itemFrom('p-004', 'XL', 'Charcoal', 1)],
  ),
  buildOrder(
    'ORD-1003',
    'Rohan Mehta',
    'rohan.mehta@example.com',
    '2026-07-05',
    'processing',
    'pending',
    'Cash on Delivery',
    '9 Sector 21, Noida, Uttar Pradesh 201301',
    [itemFrom('p-002', 'S', 'Crimson', 1), itemFrom('p-008', 'M', 'Black', 1)],
  ),
  buildOrder(
    'ORD-1004',
    'Sneha Kapoor',
    'sneha.kapoor@example.com',
    '2026-07-04',
    'delivered',
    'paid',
    'UPI',
    '78 Salt Lake Sector V, Kolkata, West Bengal 700091',
    [itemFrom('p-005', 'M', 'Ivory', 3)],
  ),
  buildOrder(
    'ORD-1005',
    'Vikram Singh',
    'vikram.singh@example.com',
    '2026-06-30',
    'cancelled',
    'refunded',
    'Card',
    '33 Ashok Nagar, Chennai, Tamil Nadu 600083',
    [itemFrom('p-006', 'L', 'Crimson', 1)],
  ),
  buildOrder(
    'ORD-1006',
    'Ananya Iyer',
    'ananya.iyer@example.com',
    '2026-07-08',
    'processing',
    'paid',
    'Card',
    '5 Baner Road, Pune, Maharashtra 411045',
    [itemFrom('p-007', 'XL', 'Black', 1), itemFrom('p-009', 'L', 'Charcoal', 2)],
  ),
  buildOrder(
    'ORD-1007',
    'Karan Malhotra',
    'karan.malhotra@example.com',
    '2026-07-03',
    'shipped',
    'paid',
    'UPI',
    '61 Model Town, Ludhiana, Punjab 141002',
    [itemFrom('p-001', 'XL', 'Crimson', 1)],
  ),
  buildOrder(
    'ORD-1008',
    'Neha Joshi',
    'neha.joshi@example.com',
    '2026-07-01',
    'delivered',
    'paid',
    'Net Banking',
    '17 Vastrapur, Ahmedabad, Gujarat 380015',
    [itemFrom('p-003', 'S', 'Black', 2), itemFrom('p-005', 'M', 'Ivory', 1)],
  ),
  buildOrder(
    'ORD-1009',
    'Aditya Rao',
    'aditya.rao@example.com',
    '2026-06-27',
    'delivered',
    'paid',
    'UPI',
    '221 Marine Lines, Mumbai, Maharashtra 400002',
    [itemFrom('p-008', 'L', 'Crimson', 1)],
  ),
  buildOrder(
    'ORD-1010',
    'Priya Sharma',
    'priya.sharma@example.com',
    '2026-06-22',
    'cancelled',
    'failed',
    'Card',
    '14 Koramangala 5th Block, Bengaluru, Karnataka 560095',
    [itemFrom('p-002', 'M', 'Black', 1)],
  ),
];
