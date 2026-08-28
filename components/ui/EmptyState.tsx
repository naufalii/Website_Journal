import React from 'react';
import { Button } from './Button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-surface-light/40 dark:bg-surface-dark/40 transition-all',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary dark:text-brand-vibrant mb-4 shadow-soft">
        {icon}
      </div>
      <h4 className="text-base font-bold text-content-primaryLight dark:text-content-primaryDark mb-1.5">{title}</h4>
      <p className="text-xs sm:text-sm text-content-mutedLight dark:text-content-mutedDark max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
}
