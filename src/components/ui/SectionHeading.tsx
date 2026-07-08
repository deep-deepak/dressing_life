import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center', className)}>
      {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red-700">{eyebrow}</span>}
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description && <p className="max-w-2xl text-sm text-brand-gray-500 sm:text-base">{description}</p>}
    </div>
  );
}
