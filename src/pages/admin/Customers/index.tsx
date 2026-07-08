import { useMemo, useState } from 'react';
import { Ban, CheckCircle2, Eye, Search } from 'lucide-react';
import type { AdminCustomer } from '@/types';
import { getAdminCustomers, setCustomerStatus } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, ConfirmDialog, Input, Pagination, Select, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { formatCurrency } from '@/utils';
import { CustomerDetailsModal } from './CustomerDetailsModal';

const STATUS_VARIANT: Record<AdminCustomer['status'], 'dark' | 'red' | 'outline'> = {
  active: 'dark',
  blocked: 'red',
};

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AdminCustomer['status'] | ''>('');
  const [reloadKey, setReloadKey] = useState(0);
  const { data: customers, isLoading, error } = useAsync(() => getAdminCustomers(), [reloadKey]);

  const detailsModal = useDisclosure();
  const blockDialog = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | undefined>();
  const [blockingCustomer, setBlockingCustomer] = useState<AdminCustomer | undefined>();
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = useMemo(() => {
    let results = customers ?? [];
    if (status) results = results.filter((c) => c.status === status);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return results;
  }, [customers, status, search]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const openDetails = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    detailsModal.open();
  };

  const requestBlock = (customer: AdminCustomer) => {
    setBlockingCustomer(customer);
    blockDialog.open();
  };

  const confirmBlock = async () => {
    if (!blockingCustomer) return;
    setIsUpdating(true);
    await setCustomerStatus(blockingCustomer.id, 'blocked');
    setIsUpdating(false);
    blockDialog.close();
    setReloadKey((k) => k + 1);
  };

  const handleUnblock = async (customer: AdminCustomer) => {
    await setCustomerStatus(customer.id, 'active');
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<AdminCustomer>[] = [
    {
      key: 'name',
      header: 'Customer',
      render: (c) => (
        <div className="flex items-center gap-3">
          {c.avatarUrl ? (
            <img src={c.avatarUrl} alt={c.name} className="size-10 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-black text-xs font-semibold text-brand-white">
              {c.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{c.name}</span>
            <span className="text-xs text-brand-gray-500">{c.email}</span>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (c) => c.phone ?? '—' },
    { key: 'totalOrders', header: 'Orders', render: (c) => c.totalOrders },
    { key: 'totalSpent', header: 'Total Spent', render: (c) => formatCurrency(c.totalSpent) },
    { key: 'joinedAt', header: 'Joined', render: (c) => c.joinedAt },
    { key: 'status', header: 'Status', render: (c) => <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openDetails(c)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`View ${c.name}`}>
            <Eye size={16} />
          </button>
          {c.status === 'active' ? (
            <button
              type="button"
              onClick={() => requestBlock(c)}
              className="text-brand-gray-500 hover:text-brand-red-700"
              aria-label={`Block ${c.name}`}
            >
              <Ban size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleUnblock(c)}
              className="text-brand-gray-500 hover:text-brand-black"
              aria-label={`Unblock ${c.name}`}
            >
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Customers" description="View and manage storefront customer accounts." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          placeholder="All statuses"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'blocked', label: 'Blocked' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value as AdminCustomer['status'] | '')}
          className="sm:w-52"
        />
      </div>

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(c) => c.id}
        isLoading={isLoading}
        emptyTitle="No customers found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CustomerDetailsModal customer={selectedCustomer} isOpen={detailsModal.isOpen} onClose={detailsModal.close} />

      <ConfirmDialog
        isOpen={blockDialog.isOpen}
        onClose={blockDialog.close}
        onConfirm={confirmBlock}
        title="Block Customer"
        description={`Are you sure you want to block "${blockingCustomer?.name}"? They will not be able to place orders while blocked.`}
        confirmLabel="Block"
        isLoading={isUpdating}
      />
    </div>
  );
}
