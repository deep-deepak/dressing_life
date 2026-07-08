import { cn } from '@/utils';

interface LogoProps {
  variant?: 'full' | 'mark';
  theme?: 'light' | 'dark';
  className?: string;
}

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" role="img" aria-label="Dressing Life">
      <circle cx="120" cy="120" r="120" fill="#0a0a0a" />
      <rect x="42" y="82" width="18" height="86" fill="#ffffff" />
      <path
        d="M76 56 H120 C158 56 184 84 184 120 C184 156 158 184 120 184 H76 V146 H114 C132 146 146 134 146 120 C146 106 132 94 114 94 H76 Z"
        fill="#7a0f0f"
      />
    </svg>
  );
}

export function Logo({ variant = 'full', theme = 'dark', className }: LogoProps) {
  if (variant === 'mark') {
    return <LogoMark />;
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <LogoMark size={36} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-lg font-semibold uppercase tracking-[0.15em]',
            theme === 'dark' ? 'text-brand-white' : 'text-brand-black',
          )}
        >
          Dressing Life
        </span>
        <span
          className={cn(
            'text-[9px] font-medium uppercase tracking-[0.35em]',
            theme === 'dark' ? 'text-brand-gray-300' : 'text-brand-gray-500',
          )}
        >
          Wear Your Story
        </span>
      </div>
    </div>
  );
}
