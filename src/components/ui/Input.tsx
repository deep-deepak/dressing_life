import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full border border-brand-gray-300 bg-brand-white px-4 text-sm text-brand-black placeholder:text-brand-gray-400 focus:border-brand-black focus:outline-none',
            error && 'border-brand-red-600',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-brand-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wide text-brand-gray-600">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'min-h-32 w-full border border-brand-gray-300 bg-brand-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-gray-400 focus:border-brand-black focus:outline-none',
            error && 'border-brand-red-600',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-brand-red-600">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
