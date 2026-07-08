import { useState } from 'react';
import { Eye, Search } from 'lucide-react';
import type { AdminOrder, OrderStatus } from '@/types';
import { getAdminOrders, updateOrderStatus } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Input, Pagination, Select, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { formatCurrency } from '@/utils';
import { OrderDetailsModal } from './OrderDetailsModal';

const STATUS_VARIANT: Record<OrderStatus, 'dark' | 'red' | 'outline'> = {
  processing: 'outline',
  shipped: 'dark',
  delivered: 'red',
  cancelled: 'outline',
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [reloadKey, setReloadKey] = useState(0);

  const { data: orders, isLoading } = useAsync(
    () => getAdminOrders({ search: search || undefined, status: status || undefined }),
    [search, status, reloadKey],
  );

  const { page, setPage, totalPages, paginated } = usePagination(orders ?? [], 8);

  const detailsModal = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | undefined>();

  const openDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    detailsModal.open();
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const updated = await updateOrderStatus(selectedOrder.id, newStatus);
    setSelectedOrder(updated);
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<AdminOrder>[] = [
    { key: 'id', header: 'Order ID', render: (o) => <span className="font-medium">{o.id}</span> },
    {
      key: 'customer',
      header: 'Customer',
      render: (o) => (
        <div className="flex flex-col">
          <span>{o.customerName}</span>
          <span className="text-xs text-brand-gray-500">{o.customerEmail}</span>
        </div>
      ),
    },
    { key: 'date', header: 'Date', render: (o) => o.placedAt },
    { key: 'items', header: 'Items', render: (o) => o.items.reduce((acc, i) => acc + i.quantity, 0) },
    { key: 'total', header: 'Total', render: (o) => formatCurrency(o.total) },
    { key: 'status', header: 'Status', render: (o) => <Badge variant={STATUS_VARIANT[o.status]}>{o.status}</Badge> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (o) => (
        <button type="button" onClick={() => openDetails(o)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`View ${o.id}`}>
          <Eye size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Orders" description="Track and manage customer orders." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by order ID or customer" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          placeholder="All statuses"
          options={[
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | '')}
          className="sm:w-52"
        />
      </div>

      <Table columns={columns} data={paginated} rowKey={(o) => o.id} isLoading={isLoading} emptyTitle="No orders found" />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <OrderDetailsModal order={selectedOrder} isOpen={detailsModal.isOpen} onClose={detailsModal.close} onStatusChange={handleStatusChange} />
    </div>
  );
}
