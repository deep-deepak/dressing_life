import type { CategoryBreakdown, SalesPoint } from '@/types';
import { CATEGORY_BREAKDOWN, SALES_TREND } from './mock/admin/dashboard.data';
import { ADMIN_CUSTOMERS } from './mock/admin/customers.data';
import { simulateDelay } from './simulateDelay';

export async function getSalesReport(): Promise<SalesPoint[]> {
  return simulateDelay(SALES_TREND);
}

export async function getCategoryReport(): Promise<CategoryBreakdown[]> {
  return simulateDelay(CATEGORY_BREAKDOWN);
}

export async function getCustomerGrowth(): Promise<{ label: string; customers: number }[]> {
  const totalNow = ADMIN_CUSTOMERS.length;
  const points = SALES_TREND.map((point, index) => ({
    label: point.label,
    customers: Math.max(1, Math.round((totalNow / SALES_TREND.length) * (index + 1))),
  }));
  return simulateDelay(points);
}
