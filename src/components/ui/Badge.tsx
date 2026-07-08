import type { ReactNode } from 'react';
import { cn } from '@/utils';

type BadgeVariant = 'dark' | 'red' | 'outline';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  dark: 'bg-brand-black text-brand-white',
  red: 'bg-brand-red-700 text-brand-white',
  outline: 'border border-brand-black text-brand-black',
};

export function Badge({ children, variant = 'dark', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
