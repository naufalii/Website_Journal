import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
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
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-content-mutedLight dark:text-content-mutedDark pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-app-light dark:bg-app-dark/70 px-4 py-3 text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:border-brand-primary dark:focus:border-brand-vibrant focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all duration-200 disabled:opacity-50',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 text-content-mutedLight dark:text-content-mutedDark flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-content-mutedLight dark:text-content-mutedDark">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
