import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils';

interface StatCardProps {
  label: string;
  value: string;
  changePct?: number;
  icon: ReactNode;
}

export function StatCard({ label, value, changePct, icon }: StatCardProps) {
  const isPositive = (changePct ?? 0) >= 0;

  return (
    <div className="flex flex-col gap-4 border border-brand-gray-200 bg-brand-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500">{label}</span>
        <div className="flex size-9 items-center justify-center bg-brand-black text-brand-white">{icon}</div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="font-display text-2xl">{value}</span>
        {changePct != null && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold',
              isPositive ? 'text-brand-red-700' : 'text-brand-gray-500',
            )}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(changePct).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
