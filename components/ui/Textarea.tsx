import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold uppercase tracking-wider text-content-mutedLight dark:text-content-mutedDark"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-app-light dark:bg-app-dark/70 px-4 py-3 text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:border-brand-primary dark:focus:border-brand-vibrant focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 disabled:opacity-50 resize-y',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
