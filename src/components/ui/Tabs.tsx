import { cn } from '@/utils';

interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-6 border-b border-brand-gray-200', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'border-b-2 pb-3 text-xs font-semibold uppercase tracking-wide transition-colors',
            value === tab.value
              ? 'border-brand-black text-brand-black'
              : 'border-transparent text-brand-gray-500 hover:text-brand-black',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
