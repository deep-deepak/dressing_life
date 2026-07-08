import type { AdminOrder, CategoryBreakdown, DashboardStats, SalesPoint } from '@/types';
import { CATEGORY_BREAKDOWN, DASHBOARD_STATS, SALES_TREND } from './mock/admin/dashboard.data';
import { ADMIN_ORDERS } from './mock/admin/orders.data';
import { simulateDelay } from './simulateDelay';

export async function getDashboardStats(): Promise<DashboardStats> {
  return simulateDelay(DASHBOARD_STATS);
}

export async function getSalesTrend(): Promise<SalesPoint[]> {
  return simulateDelay(SALES_TREND);
}

export async function getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  return simulateDelay(CATEGORY_BREAKDOWN);
}

export async function getRecentOrders(limit = 5): Promise<AdminOrder[]> {
  const sorted = [...ADMIN_ORDERS].sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  return simulateDelay(sorted.slice(0, limit));
}
