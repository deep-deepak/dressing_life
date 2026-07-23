import type { CategoryBreakdown, SalesPoint } from '@/types';
import { api } from './api';

export async function getSalesReport(): Promise<SalesPoint[]> {
  const { data } = await api.get<SalesPoint[]>('/reports/sales');
  return data;
}

export async function getCategoryReport(): Promise<CategoryBreakdown[]> {
  const { data } = await api.get<CategoryBreakdown[]>('/reports/category');
  return data;
}

export async function getCustomerGrowth(): Promise<{ label: string; customers: number }[]> {
  const { data } = await api.get<{ label: string; customers: number }[]>('/reports/customer-growth');
  return data;
}
