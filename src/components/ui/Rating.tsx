import { Star } from 'lucide-react';
import { cn } from '@/utils';

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

export function Rating({ value, reviewCount, size = 14, className }: RatingProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(value) ? 'fill-brand-red-700 text-brand-red-700' : 'fill-brand-gray-200 text-brand-gray-200'}
          />
        ))}
      </div>
      {reviewCount != null && (
        <span className="text-xs text-brand-gray-500">({reviewCount})</span>
      )}
    </div>
  );
}
