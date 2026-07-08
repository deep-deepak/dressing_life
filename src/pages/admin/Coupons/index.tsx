import { useMemo, useState } from 'react';
import { Plus, Power, Search, SquarePen, Trash2 } from 'lucide-react';
import type { Coupon, CouponPayload, CouponStatus } from '@/types';
import { createCoupon, deleteCoupon, getCoupons, toggleCouponStatus, updateCoupon } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Button, ConfirmDialog, Input, Pagination, Select, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { formatCurrency } from '@/utils';
import { CouponFormModal } from './CouponFormModal';

const STATUS_VARIANT: Record<CouponStatus, 'dark' | 'red' | 'outline'> = {
  active: 'dark',
  expired: 'outline',
  disabled: 'outline',
  scheduled: 'red',
};

export default function AdminCouponsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CouponStatus | ''>('');
  const [reloadKey, setReloadKey] = useState(0);
  const { data: coupons, isLoading, error } = useAsync(() => getCoupons(), [reloadKey]);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>();
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = coupons ?? [];
    if (status) results = results.filter((c) => c.status === status);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((c) => c.code.toLowerCase().includes(q));
    }
    return results;
  }, [coupons, status, search]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const openCreate = () => {
    setEditingCoupon(undefined);
    formModal.open();
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    formModal.open();
  };

  const handleSubmit = async (payload: CouponPayload) => {
    if (editingCoupon) {
      await updateCoupon(editingCoupon.id, payload);
    } else {
      await createCoupon(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    await toggleCouponStatus(id);
    setTogglingId(null);
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingCoupon) return;
    setIsDeleting(true);
    await deleteCoupon(deletingCoupon.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<Coupon>[] = [
    { key: 'code', header: 'Code', render: (c) => <span className="font-mono text-sm font-medium">{c.code}</span> },
    {
      key: 'value',
      header: 'Discount',
      render: (c) => (c.type === 'percentage' ? `${c.value}%` : formatCurrency(c.value)),
    },
    {
      key: 'minOrderValue',
      header: 'Min Order',
      render: (c) => (c.minOrderValue ? formatCurrency(c.minOrderValue) : '—'),
    },
    { key: 'usage', header: 'Usage', render: (c) => `${c.usedCount} / ${c.usageLimit}` },
    {
      key: 'validity',
      header: 'Validity',
      render: (c) => (
        <span className="text-xs text-brand-gray-600">
          {c.startDate} → {c.endDate}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (c) => <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(c)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${c.code}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleToggle(c.id)}
            disabled={togglingId === c.id}
            className="text-brand-gray-500 hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Toggle ${c.code}`}
          >
            <Power size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingCoupon(c);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${c.code}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Coupons"
        description="Create and manage discount coupons."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add Coupon
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by code" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          placeholder="All statuses"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'expired', label: 'Expired' },
            { value: 'disabled', label: 'Disabled' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value as CouponStatus | '')}
          className="sm:w-52"
        />
      </div>

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(c) => c.id}
        isLoading={isLoading}
        emptyTitle="No coupons found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CouponFormModal isOpen={formModal.isOpen} onClose={formModal.close} onSubmit={handleSubmit} coupon={editingCoupon} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        description={`Are you sure you want to delete "${deletingCoupon?.code}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
