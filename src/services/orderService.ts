import type { CreateOrderPayload, Order } from '@/types';
import { api } from './api';

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders/mine');
  return data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>('/orders', payload);
  return data;
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}
