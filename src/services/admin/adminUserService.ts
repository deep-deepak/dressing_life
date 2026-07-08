import type { AdminUser, AdminUserPayload } from '@/types';
import { ADMIN_USERS } from '../mock/admin/adminUsers.data';
import { simulateDelay } from '../simulateDelay';

export async function getAdminUsers(): Promise<AdminUser[]> {
  return simulateDelay([...ADMIN_USERS]);
}

export async function createAdminUser(payload: AdminUserPayload): Promise<AdminUser> {
  const newUser: AdminUser = {
    id: `au-${crypto.randomUUID().slice(0, 8)}`,
    ...payload,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  ADMIN_USERS.unshift(newUser);
  return simulateDelay(newUser);
}

export async function updateAdminUser(id: string, payload: AdminUserPayload): Promise<AdminUser> {
  const index = ADMIN_USERS.findIndex((u) => u.id === id);
  if (index === -1) throw new Error('Admin user not found.');
  ADMIN_USERS[index] = { ...ADMIN_USERS[index], ...payload };
  return simulateDelay(ADMIN_USERS[index]);
}

export async function deleteAdminUser(id: string): Promise<void> {
  const index = ADMIN_USERS.findIndex((u) => u.id === id);
  if (index !== -1) ADMIN_USERS.splice(index, 1);
  return simulateDelay(undefined);
}
