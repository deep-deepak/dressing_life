import type { ReactNode } from 'react';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';
import { cn } from '@/utils';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function Table<T>({ columns, data, rowKey, isLoading, emptyTitle = 'No records found', emptyDescription }: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center border border-brand-gray-200 bg-brand-white">
        <Spinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="border border-brand-gray-200 bg-brand-white">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-brand-gray-200 bg-brand-white">
      <table className="w-full min-w-max text-left text-sm">
        <thead className="border-b border-brand-gray-200 bg-brand-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-gray-600', col.headerClassName)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="border-b border-brand-gray-100 last:border-0 hover:bg-brand-gray-50">
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 align-middle', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
