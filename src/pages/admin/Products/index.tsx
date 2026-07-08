import { useMemo, useState } from 'react';
import { Plus, Search, SquarePen, Trash2 } from 'lucide-react';
import type { Product } from '@/types';
import { createProduct, deleteProduct, getProducts, updateProduct, type ProductPayload } from '@/services';
import { CATEGORIES } from '@/services/mock/products.data';
import { useAsync, useDisclosure, usePagination } from '@/hooks';
import { Badge, Button, ConfirmDialog, Input, Pagination, Select, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { formatCurrency } from '@/utils';
import { ProductFormModal } from './ProductFormModal';

const STATUS_VARIANT: Record<NonNullable<Product['status']>, 'dark' | 'red' | 'outline'> = {
  active: 'dark',
  draft: 'outline',
  archived: 'outline',
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const { data: products, isLoading, error } = useAsync(() => getProducts(), [reloadKey]);

  const formModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingProduct, setDeletingProduct] = useState<Product | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    let results = products ?? [];
    if (category) results = results.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    return results;
  }, [products, category, search]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 6);

  const openCreate = () => {
    setEditingProduct(undefined);
    formModal.open();
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    formModal.open();
  };

  const handleSubmit = async (payload: ProductPayload) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await createProduct(payload);
    }
    setReloadKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    await deleteProduct(deletingProduct.id);
    setIsDeleting(false);
    deleteDialog.close();
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]} alt={p.name} className="size-10 shrink-0 object-cover" />
          <div className="flex flex-col">
            <span className="font-medium">{p.name}</span>
            <span className="text-xs text-brand-gray-500">{p.sku ?? p.id}</span>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (p) => p.category },
    { key: 'price', header: 'Price', render: (p) => formatCurrency(p.price) },
    { key: 'stock', header: 'Stock', render: (p) => p.stock },
    { key: 'status', header: 'Status', render: (p) => <Badge variant={STATUS_VARIANT[p.status ?? 'active']}>{p.status ?? 'active'}</Badge> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => openEdit(p)} className="text-brand-gray-500 hover:text-brand-black" aria-label={`Edit ${p.name}`}>
            <SquarePen size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingProduct(p);
              deleteDialog.open();
            }}
            className="text-brand-gray-500 hover:text-brand-red-700"
            aria-label={`Delete ${p.name}`}
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
        title="Products"
        description="Manage your product catalog."
        action={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add Product
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select
          placeholder="All categories"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:w-52"
        />
      </div>

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        emptyTitle="No products found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ProductFormModal isOpen={formModal.isOpen} onClose={formModal.close} onSubmit={handleSubmit} product={editingProduct} />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
