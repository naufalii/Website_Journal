import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'cyan' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    default:
      'bg-surface-lightPill dark:bg-surface-darkPill text-content-primaryLight dark:text-content-primaryDark border-transparent',
    primary:
      'bg-brand-primary/10 text-brand-primary dark:text-brand-vibrant border-brand-primary/20',
    cyan:
      'bg-brand-cyan/10 text-cyan-600 dark:text-brand-cyan border-brand-cyan/20',
    success:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  const sizes = {
    sm: 'text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold border',
    md: 'text-xs px-3 py-1 rounded-full font-bold border',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 transition-colors', variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
