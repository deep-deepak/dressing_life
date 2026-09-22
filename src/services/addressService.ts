import type { Address, User } from '@/types';
import { api } from './api';

export type AddAddressPayload = Omit<Address, 'id'>;

export async function addAddress(payload: AddAddressPayload): Promise<User> {
  const { data } = await api.post<User>('/auth/me/addresses', payload);
  return data;
}
