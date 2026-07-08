import type { AdminNotification } from '@/types';
import { ADMIN_NOTIFICATIONS } from '../mock/admin/notifications.data';
import { simulateDelay } from '../simulateDelay';

export async function getNotifications(): Promise<AdminNotification[]> {
  const sorted = [...ADMIN_NOTIFICATIONS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return simulateDelay(sorted);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const index = ADMIN_NOTIFICATIONS.findIndex((n) => n.id === id);
  if (index !== -1) ADMIN_NOTIFICATIONS[index] = { ...ADMIN_NOTIFICATIONS[index], isRead: true };
  return simulateDelay(undefined);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  ADMIN_NOTIFICATIONS.forEach((n, i) => {
    ADMIN_NOTIFICATIONS[i] = { ...n, isRead: true };
  });
  return simulateDelay(undefined);
}
