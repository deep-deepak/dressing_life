import { formatCurrency } from '@/utils';
import { cn } from '@/utils';

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function PriceTag({ price, compareAtPrice, size = 'md', className }: PriceTagProps) {
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-semibold', sizeClasses[size])}>{formatCurrency(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <span className="text-sm text-brand-gray-400 line-through">{formatCurrency(compareAtPrice)}</span>
      )}
    </div>
  );
}
