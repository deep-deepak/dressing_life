import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { useAsync } from '@/hooks';
import { getCategoryBreakdown, getDashboardStats, getRecentOrders, getSalesTrend } from '@/services';
import { PageLoader, Table, type TableColumn } from '@/components/ui';
import { Badge } from '@/components/ui';
import { PageHeader, StatCard, LineChartCard, DonutChartCard } from '@/components/admin';
import { formatCurrency } from '@/utils';
import type { AdminOrder } from '@/types';

const ORDER_STATUS_VARIANT: Record<AdminOrder['status'], 'dark' | 'red' | 'outline'> = {
  processing: 'outline',
  shipped: 'dark',
  delivered: 'red',
  cancelled: 'outline',
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAsync(() => getDashboardStats(), []);
  const { data: salesTrend, isLoading: trendLoading } = useAsync(() => getSalesTrend(), []);
  const { data: categoryBreakdown, isLoading: categoryLoading } = useAsync(() => getCategoryBreakdown(), []);
  const { data: recentOrders, isLoading: ordersLoading } = useAsync(() => getRecentOrders(6), []);

  const columns: TableColumn<AdminOrder>[] = [
    { key: 'id', header: 'Order', render: (o) => <span className="font-medium">{o.id}</span> },
    { key: 'customer', header: 'Customer', render: (o) => o.customerName },
    { key: 'date', header: 'Date', render: (o) => o.placedAt },
    { key: 'status', header: 'Status', render: (o) => <Badge variant={ORDER_STATUS_VARIANT[o.status]}>{o.status}</Badge> },
    { key: 'total', header: 'Total', render: (o) => formatCurrency(o.total) },
  ];

  if (statsLoading || !stats) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Overview of store performance and recent activity." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} changePct={stats.revenueChangePct} icon={<DollarSign size={18} />} />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString('en-IN')} changePct={stats.ordersChangePct} icon={<ShoppingBag size={18} />} />
        <StatCard label="Total Customers" value={stats.totalCustomers.toLocaleString('en-IN')} changePct={stats.customersChangePct} icon={<Users size={18} />} />
        <StatCard label="Total Products" value={stats.totalProducts.toString()} changePct={stats.productsChangePct} icon={<Package size={18} />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        {trendLoading || !salesTrend ? <PageLoader /> : <LineChartCard title="Sales Trend" data={salesTrend} dataKey="revenue" xKey="label" />}
        {categoryLoading || !categoryBreakdown ? (
          <PageLoader />
        ) : (
          <DonutChartCard
            title="Sales by Category"
            data={categoryBreakdown.map((c) => ({ name: c.category, value: c.value }))}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-sm uppercase tracking-wide">Recent Orders</h2>
        <Table columns={columns} data={recentOrders ?? []} rowKey={(o) => o.id} isLoading={ordersLoading} />
      </div>
    </div>
  );
}
