import type { ProductSize } from '@/types';
import { cn } from '@/utils';

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Graphic', 'Solid', 'Oversized', 'Henley', 'Full Sleeve'];

interface FilterSidebarProps {
  activeCategory?: string;
  activeSize?: string;
  onCategoryChange: (category?: string) => void;
  onSizeChange: (size?: ProductSize) => void;
}

export function FilterSidebar({ activeCategory, activeSize, onCategoryChange, onSizeChange }: FilterSidebarProps) {
  return (
    <aside className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-sm uppercase tracking-wide">Category</h3>
        <ul className="flex flex-col gap-2">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange(undefined)}
              className={cn('text-sm text-brand-gray-500 hover:text-brand-black', !activeCategory && 'font-semibold text-brand-black')}
            >
              All T-Shirts
            </button>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'text-sm text-brand-gray-500 hover:text-brand-black',
                  activeCategory === category && 'font-semibold text-brand-black',
                )}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-sm uppercase tracking-wide">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange(activeSize === size ? undefined : size)}
              className={cn(
                'flex size-9 items-center justify-center border text-xs font-medium',
                activeSize === size
                  ? 'border-brand-black bg-brand-black text-brand-white'
                  : 'border-brand-gray-300 text-brand-black hover:border-brand-black',
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
