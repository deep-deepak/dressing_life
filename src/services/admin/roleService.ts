import type { Permission, Role, RolePayload } from '@/types';
import { api } from '../api';

export async function getRoles(): Promise<Role[]> {
  const { data } = await api.get<Role[]>('/roles');
  return data;
}

export async function getPermissions(): Promise<Permission[]> {
  const { data } = await api.get<Permission[]>('/roles/permissions');
  return data;
}

export async function createRole(payload: RolePayload): Promise<Role> {
  const { data } = await api.post<Role>('/roles', payload);
  return data;
}

export async function updateRole(id: string, payload: RolePayload): Promise<Role> {
  const { data } = await api.put<Role>(`/roles/${id}`, payload);
  return data;
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`/roles/${id}`);
}
