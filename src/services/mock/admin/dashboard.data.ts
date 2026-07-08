import type { CategoryBreakdown, DashboardStats, SalesPoint } from '@/types';

export const DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 1284500,
  revenueChangePct: 12.4,
  totalOrders: 842,
  ordersChangePct: 8.1,
  totalCustomers: 396,
  customersChangePct: 5.6,
  totalProducts: 9,
  productsChangePct: -2.3,
};

export const SALES_TREND: SalesPoint[] = [
  { label: 'Jan', revenue: 78000, orders: 54 },
  { label: 'Feb', revenue: 91000, orders: 61 },
  { label: 'Mar', revenue: 86500, orders: 58 },
  { label: 'Apr', revenue: 102000, orders: 70 },
  { label: 'May', revenue: 118500, orders: 82 },
  { label: 'Jun', revenue: 134200, orders: 94 },
  { label: 'Jul', revenue: 142800, orders: 101 },
];

export const CATEGORY_BREAKDOWN: CategoryBreakdown[] = [
  { category: 'Graphic', value: 38 },
  { category: 'Solid', value: 27 },
  { category: 'Oversized', value: 15 },
  { category: 'Henley', value: 12 },
  { category: 'Full Sleeve', value: 8 },
];
