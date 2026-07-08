import { useState } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import type { Banner, BannerPayload } from '@/types';
import { createBanner, deleteBanner, getBanners, updateBanner } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Button, ConfirmDialog, Pagination, Switch, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { BannerFormModal } from './BannerFormModal';

const POSITION_LABEL: Record<Banner['position'], string> = {
  'homepage-hero': 'Homepage Hero',
  'homepage-promo': 'Homepage Promo',
  'category-top': 'Category Top',
};

export default function AdminBannersPage() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: banners, isLoading, error } = useAsync(() => getBanners(), [reloadKey]);

  const { page, setPage, totalPages, paginated } = usePagination(banners ?? [], 8);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>();
  const [deletingBanner, setDeletingBanner] = useState<Banner | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditingBanner(undefined);
    formModal.open();
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    formModal.open();
  };

  const handleSubmit = async (payload: BannerPayload) => {
    if (editingBanner) {
      await updateBanner(editingBanner.id, payload);
    } else {
      await createBanner(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const handleToggleStatus = async (banner: Banner) => {
    const nextStatus: Banner['status'] = banner.status === 'active' ? 'inactive' : 'active';
    await updateBanner(banner.id, {
      title: banner.title,
      imageUrl: banner.imageUrl,
      link: banner.link,
      position: banner.position,
      order: banner.order,
      status: nextStatus,
      startDate: banner.startDate,
      endDate: banner.endDate,
    });
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingBanner) return;
    setIsDeleting(true);
    await deleteBanner(deletingBanner.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<Banner>[] = [
    {
      key: 'preview',
      header: 'Preview',
      render: (b) => <img src={b.imageUrl} alt={b.title} className="h-16 w-32 object-cover" />,
    },
    {
      key: 'title',
      header: 'Title',
      render: (b) => (
        <div className="flex flex-col">
          <span className="font-medium">{b.title}</span>
          {b.link && <span className="text-xs text-brand-gray-500">{b.link}</span>}
        </div>
      ),
    },
    { key: 'position', header: 'Position', render: (b) => <Badge variant="outline">{POSITION_LABEL[b.position]}</Badge> },
    { key: 'order', header: 'Order', render: (b) => b.order },
    {
      key: 'status',
      header: 'Status',
      render: (b) => <Switch checked={b.status === 'active'} onChange={() => handleToggleStatus(b)} />,
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (b) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(b)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${b.title}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingBanner(b);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${b.title}`}
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
        title="Banners"
        description="Manage promotional banners shown across the storefront."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add Banner
          </Button>
        }
      />

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(b) => b.id}
        isLoading={isLoading}
        emptyTitle="No banners found"
        emptyDescription="Create a banner to feature it on the storefront."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <BannerFormModal isOpen={formModal.isOpen} onClose={formModal.close} onSubmit={handleSubmit} banner={editingBanner} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Banner"
        description={`Are you sure you want to delete "${deletingBanner?.title}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
