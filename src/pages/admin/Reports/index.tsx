import { useAsync } from '@/hooks';
import { getCategoryReport, getCustomerGrowth, getSalesReport } from '@/services';
import { PageLoader } from '@/components/ui';
import { PageHeader, BarChartCard, DonutChartCard, LineChartCard } from '@/components/admin';

export default function AdminReportsPage() {
  const { data: salesReport, isLoading: salesLoading } = useAsync(() => getSalesReport(), []);
  const { data: categoryReport, isLoading: categoryLoading } = useAsync(() => getCategoryReport(), []);
  const { data: customerGrowth, isLoading: growthLoading } = useAsync(() => getCustomerGrowth(), []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports & Analytics" description="Deep dive into sales, category, and customer performance." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {salesLoading || !salesReport ? <PageLoader /> : <BarChartCard title="Revenue by Period" data={salesReport} dataKey="revenue" xKey="label" />}
        {salesLoading || !salesReport ? <PageLoader /> : <BarChartCard title="Orders by Period" data={salesReport} dataKey="orders" xKey="label" />}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.6fr]">
        {categoryLoading || !categoryReport ? (
          <PageLoader />
        ) : (
          <DonutChartCard title="Sales by Category" data={categoryReport.map((c) => ({ name: c.category, value: c.value }))} />
        )}
        {growthLoading || !customerGrowth ? (
          <PageLoader />
        ) : (
          <LineChartCard title="Customer Growth" data={customerGrowth} dataKey="customers" xKey="label" />
        )}
      </div>
    </div>
  );
}
