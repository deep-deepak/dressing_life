import type { AdminOrder, OrderStatus } from '@/types';
import { api } from '../api';

export interface AdminOrderFilters {
  status?: OrderStatus;
  search?: string;
}

export async function getAdminOrders(filters: AdminOrderFilters = {}): Promise<AdminOrder[]> {
  const { data } = await api.get<AdminOrder[]>('/orders', { params: filters });
  return data;
}

export async function getAdminOrderById(id: string): Promise<AdminOrder | undefined> {
  const { data } = await api.get<AdminOrder | null>(`/orders/${id}`);
  return data ?? undefined;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<AdminOrder> {
  const { data } = await api.patch<AdminOrder>(`/orders/${id}/status`, { status });
  return data;
}
