import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 10 }: QuantitySelectorProps) {
  return (
    <div className="flex h-11 w-fit items-center border border-brand-gray-300">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-full w-10 items-center justify-center text-brand-black transition-colors hover:bg-brand-gray-100 disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-full w-10 items-center justify-center text-brand-black transition-colors hover:bg-brand-gray-100 disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
