export interface DashboardStats {
  totalRevenue: number;
  revenueChangePct: number;
  totalOrders: number;
  ordersChangePct: number;
  totalCustomers: number;
  customersChangePct: number;
  totalProducts: number;
  productsChangePct: number;
}

export interface SalesPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface CategoryBreakdown {
  category: string;
  value: number;
}
