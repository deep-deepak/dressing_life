import { useMemo, useState } from 'react';
import { MinusCircle, PlusCircle, Search } from 'lucide-react';
import type { InventoryItem } from '@/types';
import { adjustStock, getInventory } from '@/services';
import { useAsync, usePagination } from '@/hooks';
import { Badge, Input, Pagination, Table, type TableColumn } from '@/components/ui';
import { PageHeader } from '@/components/admin';
import { cn } from '@/utils';

export default function AdminInventoryPage() {
  const [search, setSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const { data: inventory, isLoading, error } = useAsync(() => getInventory(), [reloadKey]);

  const filtered = useMemo(() => {
    let results = inventory ?? [];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((i) => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    return results;
  }, [inventory, search]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const handleAdjust = async (productId: string, delta: number) => {
    setAdjustingId(productId);
    await adjustStock(productId, delta);
    setAdjustingId(null);
    setReloadKey((k) => k + 1);
  };

  const columns: TableColumn<InventoryItem>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (i) => (
        <div className="flex items-center gap-3">
          <img src={i.image} alt={i.productName} className="size-10 shrink-0 object-cover" />
          <div className="flex flex-col">
            <span className="font-medium">{i.productName}</span>
            <span className="text-xs text-brand-gray-500">{i.sku}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (i) => (
        <div className="flex items-center gap-2">
          <span className={cn(i.stock <= i.lowStockThreshold && 'font-semibold text-brand-red-700')}>{i.stock}</span>
          {i.stock <= i.lowStockThreshold && <Badge variant="red">Low Stock</Badge>}
        </div>
      ),
    },
    { key: 'reserved', header: 'Reserved', render: (i) => i.reserved },
    { key: 'available', header: 'Available', render: (i) => Math.max(0, i.stock - i.reserved) },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (i) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleAdjust(i.productId, -1)}
            disabled={adjustingId === i.productId || i.stock <= 0}
            className="text-brand-gray-500 hover:text-brand-red-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Decrease stock for ${i.productName}`}
          >
            <MinusCircle size={18} />
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(i.productId, 1)}
            disabled={adjustingId === i.productId}
            className="text-brand-gray-500 hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Increase stock for ${i.productName}`}
          >
            <PlusCircle size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Inventory" description="Track and adjust stock levels across your catalog." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-brand-gray-400" />
          <Input placeholder="Search by product name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {error && <p className="text-sm text-brand-red-600">{error}</p>}

      <Table
        columns={columns}
        data={paginated}
        rowKey={(i) => i.productId}
        isLoading={isLoading}
        emptyTitle="No inventory items found"
        emptyDescription="Try adjusting your search."
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
