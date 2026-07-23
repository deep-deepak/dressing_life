import type { AdminUser, AdminUserPayload } from '@/types';
import { api } from '../api';

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>('/admin-users');
  return data;
}

export async function createAdminUser(payload: AdminUserPayload): Promise<AdminUser> {
  const { data } = await api.post<AdminUser>('/admin-users', payload);
  return data;
}

export async function updateAdminUser(id: string, payload: AdminUserPayload): Promise<AdminUser> {
  const { data } = await api.put<AdminUser>(`/admin-users/${id}`, payload);
  return data;
}

export async function deleteAdminUser(id: string): Promise<void> {
  await api.delete(`/admin-users/${id}`);
}
