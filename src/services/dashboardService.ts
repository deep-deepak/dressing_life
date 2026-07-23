import type { AdminOrder, CategoryBreakdown, DashboardStats, SalesPoint } from '@/types';
import { api } from './api';

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/dashboard/stats');
  return data;
}

export async function getSalesTrend(): Promise<SalesPoint[]> {
  const { data } = await api.get<SalesPoint[]>('/dashboard/sales-trend');
  return data;
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  const { data } = await api.get<CategoryBreakdown[]>('/dashboard/category-breakdown');
  return data;
}

export async function getRecentOrders(limit = 5): Promise<AdminOrder[]> {
  const { data } = await api.get<AdminOrder[]>('/dashboard/recent-orders', { params: { limit } });
  return data;
}
