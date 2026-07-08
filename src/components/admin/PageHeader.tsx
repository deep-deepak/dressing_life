import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl uppercase tracking-wide">{title}</h1>
        {description && <p className="text-sm text-brand-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
