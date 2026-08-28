import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-2xl border border-slate-200 dark:border-white/10 bg-app-light dark:bg-app-dark/70 px-4 py-3 pr-10 text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:border-brand-primary dark:focus:border-brand-vibrant focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 disabled:opacity-50 cursor-pointer',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-4 h-4 w-4 text-content-mutedLight dark:text-content-mutedDark pointer-events-none" />
        </div>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
