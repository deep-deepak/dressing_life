import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import type { ProductFilters, ProductSize } from '@/types';
import { useAsync, useDisclosure } from '@/hooks';
import { getProducts } from '@/services';
import { Container, EmptyState, PageLoader } from '@/components/ui';
import { ProductCard } from '@/components/common';
import { FilterSidebar } from './FilterSidebar';

const SORT_OPTIONS: { value: NonNullable<ProductFilters['sortBy']>; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function TShirtsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mobileFilters = useDisclosure();

  const category = searchParams.get('category') ?? undefined;
  const size = (searchParams.get('size') as ProductSize | null) ?? undefined;
  const sortBy = (searchParams.get('sortBy') as ProductFilters['sortBy'] | null) ?? undefined;

  const filters: ProductFilters = useMemo(() => ({ category, size, sortBy }), [category, size, sortBy]);
  const { data: products, isLoading } = useAsync(() => getProducts(filters), [category, size, sortBy]);

  const updateParam = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <Container className="section-y">
      <div className="mb-10 flex flex-col gap-2 border-b border-brand-gray-200 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red-700">Collection</span>
        <h1 className="text-4xl font-semibold sm:text-5xl">{category ?? 'All'} T-Shirts</h1>
        <p className="text-sm text-brand-gray-500">{products?.length ?? 0} products</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar
            activeCategory={category}
            activeSize={size}
            onCategoryChange={(v) => updateParam('category', v)}
            onSizeChange={(v) => updateParam('size', v)}
          />
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={mobileFilters.open}
              className="flex items-center gap-2 border border-brand-gray-300 px-4 py-2 text-xs font-medium uppercase tracking-wide lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            <select
              value={sortBy ?? ''}
              onChange={(e) => updateParam('sortBy', e.target.value || undefined)}
              className="ml-auto h-10 border border-brand-gray-300 bg-brand-white px-3 text-sm"
            >
              <option value="">Sort by</option>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState title="No products found" description="Try adjusting your filters." />
          )}
        </div>
      </div>

      {mobileFilters.isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={mobileFilters.close} />
          <div className="relative ml-auto flex h-full w-72 flex-col gap-6 bg-brand-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm uppercase tracking-wide">Filters</h2>
              <button type="button" onClick={mobileFilters.close} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            <FilterSidebar
              activeCategory={category}
              activeSize={size}
              onCategoryChange={(v) => updateParam('category', v)}
              onSizeChange={(v) => updateParam('size', v)}
            />
          </div>
        </div>
      )}
    </Container>
  );
}
