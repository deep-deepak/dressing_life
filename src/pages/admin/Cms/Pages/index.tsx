import { useState } from 'react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import type { CmsPage, CmsPagePayload } from '@/types';
import { createCmsPage, deleteCmsPage, getCmsPages, updateCmsPage } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Button, ConfirmDialog, Pagination, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { CmsTabs } from '../CmsTabs';
import { CmsPageFormModal } from './CmsPageFormModal';

export default function AdminCmsPagesPage() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: pages, isLoading, error } = useAsync(() => getCmsPages(), [reloadKey]);

  const { page, setPage, totalPages, paginated } = usePagination(pages ?? [], 8);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingPage, setEditingPage] = useState<CmsPage | undefined>();
  const [deletingPage, setDeletingPage] = useState<CmsPage | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditingPage(undefined);
    formModal.open();
  };

  const openEdit = (cmsPage: CmsPage) => {
    setEditingPage(cmsPage);
    formModal.open();
  };

  const handleSubmit = async (payload: CmsPagePayload) => {
    if (editingPage) {
      await updateCmsPage(editingPage.id, payload);
    } else {
      await createCmsPage(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingPage) return;
    setIsDeleting(true);
    await deleteCmsPage(deletingPage.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<CmsPage>[] = [
    { key: 'title', header: 'Title', render: (p) => <span className="font-medium">{p.title}</span> },
    { key: 'slug', header: 'Slug', render: (p) => <span className="text-brand-gray-500">/{p.slug}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <Badge variant={p.status === 'published' ? 'dark' : 'outline'}>{p.status}</Badge>,
    },
    { key: 'updatedAt', header: 'Updated', render: (p) => p.updatedAt },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(p)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${p.title}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingPage(p);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${p.title}`}
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
        title="CMS"
        description="Manage static pages and blog content."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add Page
          </Button>
        }
      />

      <CmsTabs />

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        emptyTitle="No pages found"
        emptyDescription="Create a page to publish it on the storefront."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CmsPageFormModal isOpen={formModal.isOpen} onClose={formModal.close} onSubmit={handleSubmit} page={editingPage} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Page"
        description={`Are you sure you want to delete "${deletingPage?.title}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
