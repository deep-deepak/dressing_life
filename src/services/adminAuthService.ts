import type { User } from '@/types';
import { api } from './api';

interface AuthResponse {
  user: User;
  token: string;
}

export async function loginAdmin(payload: { email: string; password: string }): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/admin/auth/login', payload);
  return data;
}
