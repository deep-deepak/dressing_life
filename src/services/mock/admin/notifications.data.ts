import type { AdminNotification } from '@/types';

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'nt-001',
    type: 'order',
    title: 'New order placed',
    message: 'Ananya Iyer placed order ORD-1006 worth ₹3,297.',
    isRead: false,
    createdAt: '2026-07-08T09:15:00',
  },
  {
    id: 'nt-002',
    type: 'inventory',
    title: 'Low stock alert',
    message: 'Full Sleeve Raider Tee has only 18 units left in stock.',
    isRead: false,
    createdAt: '2026-07-08T07:40:00',
  },
  {
    id: 'nt-003',
    type: 'review',
    title: 'New review awaiting moderation',
    message: 'Ananya Iyer left a 3-star review on Full Sleeve Raider Tee.',
    isRead: false,
    createdAt: '2026-07-08T06:05:00',
  },
  {
    id: 'nt-004',
    type: 'order',
    title: 'Order cancelled',
    message: 'Priya Sharma cancelled order ORD-1010.',
    isRead: true,
    createdAt: '2026-06-22T14:22:00',
  },
  {
    id: 'nt-005',
    type: 'system',
    title: 'Coupon expiring soon',
    message: "Coupon FLAT200 expires on 2026-08-31.",
    isRead: true,
    createdAt: '2026-07-01T10:00:00',
  },
  {
    id: 'nt-006',
    type: 'inventory',
    title: 'Low stock alert',
    message: 'Red Line Henley Tee has only 20 units left in stock.',
    isRead: true,
    createdAt: '2026-06-29T11:30:00',
  },
];
