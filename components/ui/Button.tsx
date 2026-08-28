import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'cyan';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, type = 'button', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-brand-primary hover:bg-brand-deep text-white shadow-soft hover:shadow-glow focus:ring-brand-primary',
      secondary:
        'bg-surface-lightPill dark:bg-surface-darkPill text-content-primaryLight dark:text-content-primaryDark hover:bg-slate-200 dark:hover:bg-slate-700/60 focus:ring-brand-vibrant',
      outline:
        'border border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill text-content-primaryLight dark:text-content-primaryDark focus:ring-brand-primary',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
      ghost:
        'text-content-mutedLight dark:text-content-mutedDark hover:bg-surface-lightPill dark:hover:bg-surface-darkPill hover:text-content-primaryLight dark:hover:text-content-primaryDark focus:ring-brand-vibrant',
      cyan:
        'bg-brand-cyan hover:bg-cyan-600 text-slate-950 font-bold shadow-soft focus:ring-brand-cyan',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 rounded-xl',
      md: 'text-xs sm:text-sm px-4 py-2.5 gap-2 rounded-2xl',
      lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 rounded-2xl font-semibold',
      icon: 'p-2.5 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
