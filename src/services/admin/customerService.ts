import type { AdminCustomer } from '@/types';
import { api } from '../api';

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const { data } = await api.get<AdminCustomer[]>('/customers');
  return data;
}

export async function getAdminCustomerById(id: string): Promise<AdminCustomer | undefined> {
  const { data } = await api.get<AdminCustomer | null>(`/customers/${id}`);
  return data ?? undefined;
}

export async function setCustomerStatus(id: string, status: AdminCustomer['status']): Promise<AdminCustomer> {
  const { data } = await api.patch<AdminCustomer>(`/customers/${id}/status`, { status });
  return data;
}
