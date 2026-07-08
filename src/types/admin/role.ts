export interface Permission {
  key: string;
  label: string;
  group: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
}

export interface RolePayload {
  name: string;
  description: string;
  permissions: string[];
}
