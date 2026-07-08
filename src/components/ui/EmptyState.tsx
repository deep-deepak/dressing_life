import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      {icon && <div className="text-brand-gray-300">{icon}</div>}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        {description && <p className="text-sm text-brand-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
