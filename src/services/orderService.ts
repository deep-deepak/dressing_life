import type { Order } from '@/types';
import { api } from './api';

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/mine');
  return data;
}
