import type { Permission, Role, RolePayload } from '@/types';
import { ADMIN_ROLES, PERMISSIONS } from '../mock/admin/roles.data';
import { simulateDelay } from '../simulateDelay';

export async function getRoles(): Promise<Role[]> {
  return simulateDelay([...ADMIN_ROLES]);
}

export async function getPermissions(): Promise<Permission[]> {
  return simulateDelay([...PERMISSIONS]);
}

export async function createRole(payload: RolePayload): Promise<Role> {
  const newRole: Role = { id: `rl-${crypto.randomUUID().slice(0, 8)}`, usersCount: 0, ...payload };
  ADMIN_ROLES.push(newRole);
  return simulateDelay(newRole);
}

export async function updateRole(id: string, payload: RolePayload): Promise<Role> {
  const index = ADMIN_ROLES.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Role not found.');
  ADMIN_ROLES[index] = { ...ADMIN_ROLES[index], ...payload };
  return simulateDelay(ADMIN_ROLES[index]);
}

export async function deleteRole(id: string): Promise<void> {
  const index = ADMIN_ROLES.findIndex((r) => r.id === id);
  if (index !== -1) ADMIN_ROLES.splice(index, 1);
  return simulateDelay(undefined);
}
