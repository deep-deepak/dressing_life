import type { AdminNotification } from '@/types';
import { api } from '../api';

export async function getNotifications(): Promise<AdminNotification[]> {
  const { data } = await api.get<AdminNotification[]>('/notifications');
  return data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}
