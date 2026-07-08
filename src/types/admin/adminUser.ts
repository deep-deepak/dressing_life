export type AdminUserRole = 'admin' | 'manager' | 'support';
export type AdminUserStatus = 'active' | 'inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface AdminUserPayload {
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}
