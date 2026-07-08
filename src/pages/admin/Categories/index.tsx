import { useMemo, useState } from 'react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import type { Category, CategoryPayload } from '@/types';
import { createCategory, deleteCategory, getAdminCategories, updateCategory } from '@/services';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Button, ConfirmDialog, Input, Pagination, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { CategoryFormModal } from './CategoryFormModal';

const STATUS_VARIANT: Record<Category['status'], 'dark' | 'red' | 'outline'> = {
  active: 'dark',
  inactive: 'outline',
};

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const { data: categories, isLoading, error } = useAsync(() => getAdminCategories(), [reloadKey]);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const byId = useMemo(() => {
    const map = new Map<string, Category>();
    (categories ?? []).forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    let results = categories ?? [];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }
    return results;
  }, [categories, search]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const openCreate = () => {
    setEditingCategory(undefined);
    formModal.open();
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    formModal.open();
  };

  const handleSubmit = async (payload: CategoryPayload) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, payload);
    } else {
      await createCategory(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    await deleteCategory(deletingCategory.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<Category>[] = [
    {
      key: 'name',
      header: 'Category',
      render: (c) => (
        <div className="flex items-center gap-3">
          {c.image ? (
            <img src={c.image} alt={c.name} className="size-10 shrink-0 object-cover" />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center bg-brand-gray-100 text-xs font-semibold text-brand-gray-500">
              {c.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">{c.name}</span>
            <span className="text-xs text-brand-gray-500">{c.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'parent',
      header: 'Parent',
      render: (c) => (c.parentId ? (byId.get(c.parentId)?.name ?? '—') : '—'),
    },
    { key: 'productCount', header: 'Products', render: (c) => c.productCount },
    { key: 'status', header: 'Status', render: (c) => <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(c)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${c.name}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingCategory(c);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${c.name}`}
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
        title="Categories"
        description="Organize your product catalog into categories."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add Category
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(c) => c.id}
        isLoading={isLoading}
        emptyTitle="No categories found"
        emptyDescription="Try adjusting your search."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <CategoryFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        onSubmit={handleSubmit}
        category={editingCategory}
        categories={categories ?? []}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
